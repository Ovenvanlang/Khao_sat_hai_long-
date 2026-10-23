// Chạy: npm test     (dùng node:test có sẵn, CSDL SQLite trong bộ nhớ, không đụng tới data/*.db)
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { openDb } = require('../src/backend/db/connection');
const { migrate } = require('../src/backend/db/migrate');
const { createApp } = require('../src/backend/app');

let db, server, base;
const FIXED_NOW = () => new Date('2026-10-10T08:00:00.000Z');

// Dữ liệu tối thiểu: 2 trung tâm; phiếu #1,#2,#4 ở trung tâm 1 (ĐÃ ĐÓNG), #3 chưa đóng, #5 ĐÃ ĐÓNG ở trung tâm 2
before(async () => {
  db = openDb(':memory:');
  migrate(db);
  db.exec(`
    INSERT INTO service_center(center_name, city) VALUES ('HCM-01','TP.HCM'), ('CT-01','Cần Thơ');
    INSERT INTO customer(full_name, phone) VALUES ('Khach A','0912345678'), ('Khach B','0987654321');
    INSERT INTO ticket(ticket_code, customer_id, center_id, status, closed_at) VALUES
      ('BH000001/2026',1,1,'DA_DONG','2026-10-09T10:00:00Z'),
      ('BH000002/2026',2,1,'DA_DONG','2026-10-09T11:00:00Z'),
      ('BH000003/2026',1,1,'DANG_XU_LY',NULL),
      ('BH000004/2026',2,1,'DA_DONG','2026-10-09T12:00:00Z'),
      ('BH000005/2026',1,2,'DA_DONG','2026-10-09T13:00:00Z');
  `);
  server = createApp({ db, now: FIXED_NOW }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => { server.close(); db.close(); });

const call = async (method, path, { role, center, body } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (role) headers['X-Role'] = role;
  if (center) headers['X-Center-Id'] = String(center);
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, json: await res.json() };
};
const SYSTEM = { role: 'he_thong' };

test('UC1: hệ thống tạo khảo sát cho phiếu ĐÃ ĐÓNG -> 201, trạng thái DA_GUI, chưa có điểm', async () => {
  const r = await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 1 } });
  assert.strictEqual(r.status, 201);
  assert.strictEqual(r.json.data.status, 'DA_GUI');
  assert.strictEqual(r.json.data.score, null);
});

test('QT-10: tạo khảo sát lần 2 cho cùng một phiếu -> 409 DA_KHAO_SAT', async () => {
  const r = await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 1 } });
  assert.strictEqual(r.status, 409);
  assert.strictEqual(r.json.error, 'DA_KHAO_SAT');
});

test('QT-10: phiếu chưa ĐÃ ĐÓNG -> 409 PHIEU_CHUA_DONG', async () => {
  const r = await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 3 } });
  assert.strictEqual(r.status, 409);
  assert.strictEqual(r.json.error, 'PHIEU_CHUA_DONG');
});

test('Phiếu không tồn tại -> 404; ticket_id sai kiểu -> 400', async () => {
  assert.strictEqual((await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 999 } })).status, 404);
  assert.strictEqual((await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 'abc' } })).status, 400);
});

test('Khách không được tạo khảo sát -> 403', async () => {
  const r = await call('POST', '/api/surveys', { body: { ticket_id: 2 } });
  assert.strictEqual(r.status, 403);
});

test('UC2: điểm ngoài 1–5 hoặc sai kiểu -> 400 và khảo sát vẫn ở DA_GUI', async () => {
  for (const bad of [0, 6, 9, 2.5, '5', null]) {
    const r = await call('POST', '/api/surveys/1', { body: { score: bad } });
    assert.strictEqual(r.status, 400, `score=${JSON.stringify(bad)} phải bị từ chối`);
  }
  assert.strictEqual(db.prepare('SELECT status FROM survey_response WHERE ticket_id=1').get().status, 'DA_GUI');
});

test('UC2: nhận xét quá 500 ký tự -> 400', async () => {
  const r = await call('POST', '/api/surveys/1', { body: { score: 4, comment: 'x'.repeat(501) } });
  assert.strictEqual(r.status, 400);
});

test('UC2: gửi điểm hợp lệ -> 200, DA_TRA_LOI, low_score đúng theo BS-03', async () => {
  const ok = await call('POST', '/api/surveys/1', { body: { score: 5, comment: '  Tốt  ' } });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.json.data.status, 'DA_TRA_LOI');
  assert.strictEqual(ok.json.data.comment, 'Tốt');
  assert.strictEqual(ok.json.data.low_score, false);
  assert.strictEqual(ok.json.data.responded_at, '2026-10-10T08:00:00.000Z');
  await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 2 } });
  const low = await call('POST', '/api/surveys/2', { body: { score: 2 } });
  assert.strictEqual(low.json.data.low_score, true);
});

test('QT-10: gửi phản hồi lần 2 -> 409 và điểm cũ KHÔNG bị ghi đè', async () => {
  const r = await call('POST', '/api/surveys/1', { body: { score: 1 } });
  assert.strictEqual(r.status, 409);
  assert.strictEqual(db.prepare('SELECT score FROM survey_response WHERE ticket_id=1').get().score, 5);
});

test('NFR4: CSDL tự chặn khảo sát trùng và điểm sai kể cả khi bỏ qua tầng service', () => {
  assert.throws(() => db.prepare("INSERT INTO survey_response(ticket_id,status,sent_at) VALUES (1,'DA_GUI','x')").run(), /UNIQUE/);
  assert.throws(() => db.prepare("INSERT INTO survey_response(ticket_id,status,sent_at,score,responded_at) VALUES (4,'DA_TRA_LOI','x',9,'y')").run(), /CHECK/);
  assert.throws(() => db.prepare("INSERT INTO survey_response(ticket_id,status,sent_at) VALUES (999,'DA_GUI','x')").run(), /FOREIGN KEY/);
  assert.throws(() => db.prepare("INSERT INTO survey_response(ticket_id,status,sent_at,responded_at) VALUES (4,'DA_TRA_LOI','x','y')").run(), /CHECK/, 'DA_TRA_LOI bắt buộc có điểm');
  assert.throws(() => db.prepare("INSERT INTO survey_response(ticket_id,status,sent_at,score) VALUES (4,'DA_GUI','x',3)").run(), /CHECK/, 'DA_GUI không được có điểm');
});

test('Ngày trả lời được ghi vào dim_date (khóa ngoại) kể cả ngoài khoảng seed', async () => {
  const dateId = db.prepare('SELECT responded_date d FROM survey_response WHERE ticket_id=1').get().d;
  assert.strictEqual(dateId, '2026-10-10');
  assert.ok(db.prepare('SELECT 1 FROM dim_date WHERE date_id = ?').get(dateId));
});

test('QT-14: quản lý chỉ thấy trung tâm mình; xin trung tâm khác -> 403; khách xem danh sách -> 403', async () => {
  await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 5 } });          // khảo sát ở trung tâm 2
  const own = await call('GET', '/api/surveys', { role: 'quan_ly', center: 1 });
  assert.strictEqual(own.status, 200);
  assert.ok(own.json.data.length >= 2);
  assert.ok(own.json.data.every((s) => s.center_id === 1), 'không được lẫn dữ liệu trung tâm 2');
  assert.strictEqual((await call('GET', '/api/surveys?center_id=2', { role: 'quan_ly', center: 1 })).status, 403);
  assert.strictEqual((await call('GET', '/api/surveys', { role: 'quan_ly' })).status, 403);      // thiếu trung tâm
  assert.strictEqual((await call('GET', '/api/surveys')).status, 403);                           // khách
  const all = await call('GET', '/api/surveys', { role: 'bgd' });                                 // BGĐ thấy toàn công ty
  assert.ok(all.json.data.some((s) => s.center_id === 2));
});

test('Lọc điểm thấp score_max=2 chỉ trả phản hồi đã trả lời có điểm ≤ 2', async () => {
  const r = await call('GET', '/api/surveys?score_max=2', { role: 'quan_ly', center: 1 });
  assert.ok(r.json.data.length >= 1 && r.json.data.every((s) => s.score <= 2));
  assert.strictEqual((await call('GET', '/api/surveys?score_max=9', { role: 'bgd' })).status, 400);
});

test('QT-13: xóa mềm -> đọc lại 404 nhưng bản ghi vẫn còn; quản lý trung tâm khác không xóa được', async () => {
  assert.strictEqual((await call('DELETE', '/api/surveys/5', { role: 'quan_ly', center: 1 })).status, 403);
  assert.strictEqual((await call('DELETE', '/api/surveys/5', { role: 'quan_ly', center: 2 })).status, 200);
  assert.strictEqual((await call('GET', '/api/surveys/5')).status, 404);
  assert.strictEqual(db.prepare('SELECT is_deleted FROM survey_response WHERE ticket_id=5').get().is_deleted, 1);
  assert.strictEqual((await call('POST', '/api/surveys', { ...SYSTEM, body: { ticket_id: 5 } })).status, 409, 'phiếu đã khảo sát (kể cả đã xóa mềm) không tạo lại được');
});

test('Báo cáo CSAT chưa hiện thực -> 501 (khung route cho các buổi sau)', async () => {
  assert.strictEqual((await call('GET', '/api/reports/csat', { role: 'bgd' })).status, 501);
});

test('JSON hỏng -> 400 thay vì 500', async () => {
  const res = await fetch(`${base}/api/surveys/1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{score:' });
  assert.strictEqual(res.status, 400);
});
