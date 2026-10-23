// Lớp service: quy tắc nghiệp vụ (QT-10, QT-13, QT-14, BS-03). Không chứa SQL, không biết gì về HTTP.
const E = require('../errors');

const MAX_COMMENT = 500;
const LOW_SCORE = 2; // BS-03

function toId(value, field = 'ticket_id') {
  const n = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
  if (!Number.isSafeInteger(n) || n <= 0) throw E.invalid(`${field} phải là số nguyên dương`);
  return n;
}

function createSurveyService({ surveyRepo, ticketRepo, now = () => new Date() }) {
  function present(row) {
    return { ...row, low_score: row.score != null && row.score <= LOW_SCORE };
  }

  return {
    /** UC1 – tạo khảo sát cho phiếu ĐÃ ĐÓNG (do hệ thống kích hoạt). */
    create(rawTicketId) {
      const ticketId = toId(rawTicketId);
      const ticket = ticketRepo.findById(ticketId);
      if (!ticket) throw E.notFound('Không có phiếu bảo hành này');
      if (ticket.status !== 'DA_DONG') throw E.ticketNotClosed();            // QT-10
      if (surveyRepo.findRawByTicketId(ticketId)) throw E.alreadySurveyed(); // QT-10
      try {
        surveyRepo.insert(ticketId, now().toISOString());
      } catch (err) {                                    // hai yêu cầu đồng thời: UNIQUE(ticket_id) chặn
        if (/constraint failed/i.test(err.message)) throw E.alreadySurveyed();
        throw err;
      }
      return present(surveyRepo.findByTicketId(ticketId));
    },

    /** Xem form khảo sát của một phiếu (khách mở liên kết). Không lộ thông tin khách. */
    getByTicket(rawTicketId) {
      const row = surveyRepo.findByTicketId(toId(rawTicketId));
      if (!row) throw E.notFound('Khảo sát không khả dụng');
      return present(row);
    },

    /** UC2 – khách gửi điểm 1–5 và nhận xét. */
    submit(rawTicketId, body) {
      const ticketId = toId(rawTicketId);
      const score = body && body.score;
      if (!Number.isInteger(score) || score < 1 || score > 5) throw E.invalid('score phải là số nguyên từ 1 đến 5');
      let comment = body.comment;
      if (comment === undefined || comment === null) comment = null;
      else if (typeof comment !== 'string') throw E.invalid('comment phải là chuỗi');
      else { comment = comment.trim() || null; if (comment && comment.length > MAX_COMMENT) throw E.invalid(`comment tối đa ${MAX_COMMENT} ký tự`); }

      const raw = surveyRepo.findRawByTicketId(ticketId);
      if (!raw || raw.is_deleted) throw E.notFound('Khảo sát không khả dụng');
      if (raw.status === 'DA_TRA_LOI') throw E.alreadySurveyed();           // QT-10
      const changed = surveyRepo.submitResponse(ticketId, score, comment, now().toISOString());
      if (changed !== 1) throw E.alreadySurveyed();                          // thua cuộc đua gửi đồng thời
      return present(surveyRepo.findByTicketId(ticketId));
    },

    /** Danh sách cho nhân viên – phạm vi theo QT-14. */
    list(user, query = {}) {
      let centerId = query.center_id != null ? toId(query.center_id, 'center_id') : null;
      if (user.role === 'quan_ly') {
        if (!user.centerId) throw E.forbidden('Quản lý phải thuộc một trung tâm');
        if (centerId != null && centerId !== user.centerId) throw E.forbidden('Không được xem dữ liệu trung tâm khác (QT-14)');
        centerId = user.centerId;
      }
      if (query.status && !['DA_GUI', 'DA_TRA_LOI'].includes(query.status)) throw E.invalid('status không hợp lệ');
      const scoreMax = query.score_max != null ? Number(query.score_max) : null;
      if (scoreMax != null && !(Number.isInteger(scoreMax) && scoreMax >= 1 && scoreMax <= 5)) throw E.invalid('score_max phải từ 1 đến 5');
      const limit = Math.min(Number(query.limit) || 20, 100);
      const page = Math.max(Number(query.page) || 1, 1);
      const { rows, total } = surveyRepo.list({ status: query.status, centerId, scoreMax, limit, offset: (page - 1) * limit });
      return { data: rows.map(present), meta: { page, limit, total } };
    },

    /** Xóa MỀM (QT-13): không xóa vật lý, giữ nguyên lịch sử. */
    remove(user, rawTicketId) {
      const ticketId = toId(rawTicketId);
      const ticket = ticketRepo.findById(ticketId);
      if (!ticket) throw E.notFound('Không có phiếu bảo hành này');
      if (user.role === 'quan_ly' && ticket.center_id !== user.centerId) throw E.forbidden('Không được thao tác trung tâm khác (QT-14)');
      if (surveyRepo.softDelete(ticketId) !== 1) throw E.notFound('Khảo sát không khả dụng');
      return { ticket_id: ticketId, deleted: true };
    },
  };
}

module.exports = { createSurveyService };
