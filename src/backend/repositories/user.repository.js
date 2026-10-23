// Lớp repository: CHỈ chứa SQL cho bảng app_user.
function createUserRepository(db) {
  const byUsername = db.prepare(
    `SELECT user_id, username, password_hash, full_name, role, center_id, is_active
       FROM app_user WHERE username = ?`);
  const insert = db.prepare(
    'INSERT INTO app_user(username, password_hash, full_name, role, center_id) VALUES (?,?,?,?,?)');
  const count = db.prepare('SELECT COUNT(*) AS n FROM app_user');

  return {
    findByUsername: (username) => byUsername.get(username),
    insert: (u) => insert.run(u.username, u.passwordHash, u.fullName, u.role, u.centerId ?? null),
    count: () => count.get().n,
  };
}

module.exports = { createUserRepository };
