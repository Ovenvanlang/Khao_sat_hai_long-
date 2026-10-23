// API khảo sát (ứng với routes/surveys.routes.js).
import { request } from './client.mjs';

/** UC2 – khách mở form: công khai, không cần token. */
export async function getByTicket(ticketId) {
  const res = await request(`/api/surveys/${encodeURIComponent(ticketId)}`, { auth: false });
  return res.data;
}

/** UC2 – khách gửi điểm 1–5 và nhận xét. */
export async function submit(ticketId, { score, comment }) {
  const res = await request(`/api/surveys/${encodeURIComponent(ticketId)}`, {
    method: 'POST',
    auth: false,
    body: { score, comment: comment || undefined },
  });
  return res.data;
}

/** UC1 – hệ thống tạo khảo sát cho phiếu ĐÃ ĐÓNG (cần tài khoản vai trò he_thong). */
export async function create(ticketId) {
  const res = await request('/api/surveys', { method: 'POST', body: { ticket_id: Number(ticketId) } });
  return res.data;
}

/** Danh sách khảo sát cho nhân viên (QT-14 áp dụng ở máy chủ). */
export async function list(filters = {}) {
  return request('/api/surveys', { query: filters });
}
