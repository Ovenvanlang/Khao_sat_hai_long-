// Lỗi nghiệp vụ có mã ổn định để frontend/test dựa vào (không dựa vào câu chữ thông báo).
class AppError extends Error {
  constructor(status, code, message) {
    super(message || code);
    this.status = status;
    this.code = code;
  }
}

module.exports = {
  AppError,
  invalid: (msg) => new AppError(400, 'DU_LIEU_KHONG_HOP_LE', msg),
  forbidden: (msg) => new AppError(403, 'KHONG_DU_QUYEN', msg),
  notFound: (msg) => new AppError(404, 'KHONG_TIM_THAY', msg),
  ticketNotClosed: () => new AppError(409, 'PHIEU_CHUA_DONG', 'Chỉ khảo sát phiếu ở trạng thái ĐÃ ĐÓNG (QT-10)'),
  alreadySurveyed: () => new AppError(409, 'DA_KHAO_SAT', 'Mỗi phiếu chỉ khảo sát một lần (QT-10)'),

  // Buổi 10: đăng nhập bằng token (xem docs/thay-doi-thiet-ke.md – TD-14)
  unauthenticated: () => new AppError(401, 'CHUA_DANG_NHAP', 'Cần đăng nhập để dùng chức năng này'),
  invalidToken: () => new AppError(401, 'TOKEN_KHONG_HOP_LE', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn'),
  badCredentials: () => new AppError(401, 'SAI_TAI_KHOAN_HOAC_MAT_KHAU', 'Tên đăng nhập hoặc mật khẩu không đúng'),
};
