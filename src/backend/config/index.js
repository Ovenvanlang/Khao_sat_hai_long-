// Cấu hình đọc từ biến môi trường (.env). Không ghi mật khẩu/khóa vào mã nguồn.
require('dotenv').config({ quiet: true });

module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseFile: process.env.DATABASE_FILE || './data/khao-sat.db',

  // Khóa ký token đăng nhập. KHÔNG có giá trị mặc định: thiếu thì server từ chối chạy
  // (tránh việc vô tình phát hành token ký bằng khóa ai cũng biết).
  authSecret: process.env.AUTH_SECRET || null,
  tokenTtlHours: Number(process.env.TOKEN_TTL_HOURS) || 8,

  // Mật khẩu của 4 tài khoản DEMO do seed tạo ra (chỉ dùng cho môi trường học tập).
  demoPassword: process.env.DEMO_PASSWORD || 'Demo@2026',
};
