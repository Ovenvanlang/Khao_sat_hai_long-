// Kết nối SQLite bằng module có sẵn của Node (node:sqlite) – KHÔNG cần biên dịch thư viện native.
// Lớp bọc mỏng này là chỗ DUY NHẤT biết về thư viện CSDL: muốn đổi sang better-sqlite3/PostgreSQL chỉ sửa file này.
const fs = require('node:fs');
const path = require('node:path');

function loadSqlite() {
  try {
    return require('node:sqlite');
  } catch (err) {
    throw new Error(
      `Node ${process.versions.node} chưa có module node:sqlite. Cần Node 22.13 trở lên (khuyến nghị 22 hoặc 24 LTS). ` +
      'Kiểm tra bằng "node -v"; cài bản mới bằng nvm hoặc từ nodejs.org.');
  }
}

function openDb(file) {
  const { DatabaseSync } = loadSqlite();
  if (file !== ':memory:') fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const raw = new DatabaseSync(file);
  raw.exec('PRAGMA foreign_keys = ON');            // SQLite mặc định tắt khóa ngoại; bật cho MỌI kết nối
  return {
    prepare: (sql) => raw.prepare(sql),            // .get() / .all() / .run()
    exec: (sql) => raw.exec(sql),
    /** Trả về hàm chạy `fn` trong một transaction: lỗi thì ROLLBACK, xong thì COMMIT. */
    transaction(fn) {
      return (...args) => {
        raw.exec('BEGIN');
        try {
          const result = fn(...args);
          raw.exec('COMMIT');
          return result;
        } catch (err) {
          raw.exec('ROLLBACK');
          throw err;
        }
      };
    },
    close: () => raw.close(),
  };
}

module.exports = { openDb };
