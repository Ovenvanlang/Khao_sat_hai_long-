// Cấu hình đọc từ biến môi trường (.env). Không ghi mật khẩu/khóa vào mã nguồn.
require('dotenv').config({ quiet: true });

module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseFile: process.env.DATABASE_FILE || './data/khao-sat.db',
};
