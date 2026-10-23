// Lớp routes: nhận/trả HTTP, gọi service. Không chứa quy tắc nghiệp vụ hay SQL.
const { Router } = require('express');
const { requireRole } = require('../middleware/access');

function createSurveyRoutes(service) {
  const r = Router();

  // Create (UC1) – chỉ hệ thống kích hoạt khi phiếu ĐÃ ĐÓNG
  r.post('/', requireRole('he_thong'), (req, res) => {
    res.status(201).json({ data: service.create(req.body && req.body.ticket_id) });
  });

  // Read danh sách (UC6 mức cơ bản) – quản lý (theo trung tâm) và ban giám đốc
  r.get('/', requireRole('quan_ly', 'bgd'), (req, res) => {
    res.json(service.list(req.user, req.query));
  });

  // Read một khảo sát – khách mở liên kết (công khai, không lộ thông tin khách)
  r.get('/:ticketId', (req, res) => {
    res.json({ data: service.getByTicket(req.params.ticketId) });
  });

  // Update (UC2) – khách gửi phản hồi { score, comment }
  r.post('/:ticketId', (req, res) => {
    res.json({ data: service.submit(req.params.ticketId, req.body) });
  });

  // Delete mềm (QT-13)
  r.delete('/:ticketId', requireRole('quan_ly', 'bgd'), (req, res) => {
    res.json({ data: service.remove(req.user, req.params.ticketId) });
  });

  return r;
}

module.exports = { createSurveyRoutes };
