const config = require('./config');
const { openDb } = require('./db/connection');
const { migrate } = require('./db/migrate');
const { createApp } = require('./app');

// Không có khóa ký token thì KHÔNG chạy (tránh phát hành token ký bằng khóa mặc định ai cũng biết).
if (!config.authSecret) {
  console.error('Thiếu AUTH_SECRET. Hãy chạy: cp .env.example .env   (rồi đổi giá trị AUTH_SECRET)');
  process.exit(1);
}

const db = openDb(config.databaseFile);
migrate(db);                                   // đảm bảo CSDL luôn ở phiên bản mới nhất khi khởi động
const app = createApp({ db });
const server = app.listen(config.port, () => console.log(`API khảo sát CSAT chạy tại http://localhost:${config.port}`));

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { server.close(() => { db.close(); process.exit(0); }); });
