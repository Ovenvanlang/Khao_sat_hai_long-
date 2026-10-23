// Access Middleware (QT-14, QT-15). Buổi 8: MÔ PHỎNG vai trò bằng header, chưa đăng nhập thật
// (SSO nằm ngoài phạm vi – xem SRS mục 1.3).
//   X-Role:      he_thong | quan_ly | bgd | marketing   (không gửi = khách hàng)
//   X-Center-Id: bắt buộc với quan_ly (trung tâm họ phụ trách)
const E = require('../errors');

const STAFF_ROLES = ['he_thong', 'quan_ly', 'bgd', 'marketing'];

function attachUser(req, res, next) {
  const role = (req.header('X-Role') || 'khach_hang').toLowerCase();
  if (role !== 'khach_hang' && !STAFF_ROLES.includes(role)) return next(E.forbidden('Vai trò không hợp lệ'));
  const rawCenter = req.header('X-Center-Id');
  const centerId = rawCenter && /^\d+$/.test(rawCenter) ? Number(rawCenter) : null;
  req.user = { role, centerId };
  next();
}

function requireRole(...allowed) {
  return (req, res, next) =>
    allowed.includes(req.user.role) ? next() : next(E.forbidden(`Vai trò ${req.user.role} không có quyền`));
}

module.exports = { attachUser, requireRole };
