// Lớp repository: CHỈ chứa SQL cho bảng service_center.
function createCenterRepository(db) {
  const all = db.prepare('SELECT center_id, center_name, city FROM service_center ORDER BY center_name');
  const byId = db.prepare('SELECT center_id, center_name, city FROM service_center WHERE center_id = ?');
  return {
    findAll: () => all.all(),
    findById: (centerId) => byId.get(centerId),
  };
}

module.exports = { createCenterRepository };
