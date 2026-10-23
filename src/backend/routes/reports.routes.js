// Khung cho UC3–UC6 (báo cáo CSAT). Trả 501 cho tới khi hiện thực ở các buổi sau.
const { Router } = require('express');
const { requireRole } = require('../middleware/access');

function createReportRoutes(service) {
  const r = Router();
  r.get('/csat', requireRole('quan_ly', 'bgd', 'marketing'), (req, res) => res.json(service.csat(req.user, req.query)));
  r.get('/low-score', requireRole('quan_ly', 'bgd'), (req, res) => res.json(service.lowScore(req.user, req.query)));
  return r;
}

module.exports = { createReportRoutes };
