// Lớp repository cho báo cáo CSAT (UC3–UC5). CHỈ chứa SQL, KHÔNG tính công thức nghiệp vụ:
// việc quy ra phần trăm/cảnh báo mẫu nhỏ nằm ở report.service.js (BS-01, BS-02).
// Mọi câu lệnh chỉ đếm phản hồi ĐÃ TRẢ LỜI và chưa bị xóa mềm (QT-13).

const FROM_SURVEY = `
  FROM survey_response s
  JOIN ticket t ON t.ticket_id = s.ticket_id`;

const FROM_SURVEY_TECH = `
  FROM survey_response s
  JOIN ticket t     ON t.ticket_id     = s.ticket_id
  JOIN technician tech ON tech.technician_id = t.technician_id`;

const ANSWERED = "s.is_deleted = 0 AND s.status = 'DA_TRA_LOI'";

/** Dựng phần WHERE bổ sung từ bộ lọc. Các mảnh SQL là chuỗi cố định, giá trị truyền qua tham số. */
function scope({ centerId, from, to }) {
  const where = [];
  const params = [];
  if (centerId != null) { where.push('t.center_id = ?');       params.push(centerId); }
  if (from)             { where.push('s.responded_date >= ?'); params.push(from); }
  if (to)               { where.push('s.responded_date <= ?'); params.push(to); }
  return { sql: where.length ? ` AND ${where.join(' AND ')}` : '', params };
}

function createReportRepository(db) {
  return {
    /** Số phản hồi, số điểm cao (>=4), số điểm thấp (<=2) và điểm trung bình trong phạm vi lọc. */
    summary(filters) {
      const s = scope(filters);
      return db.prepare(`
        SELECT COUNT(*) AS total_responses,
               SUM(CASE WHEN s.score >= 4 THEN 1 ELSE 0 END) AS high_count,
               SUM(CASE WHEN s.score <= 2 THEN 1 ELSE 0 END) AS low_count,
               AVG(s.score) AS avg_score
        ${FROM_SURVEY}
        WHERE ${ANSWERED}${s.sql}`).get(...s.params);
    },

    /** Số phiếu ĐÃ ĐÓNG trong khoảng (mẫu số của tỷ lệ phản hồi hiển thị trên thẻ KPI). */
    closedTickets({ centerId, from, to }) {
      const where = ["t.status = 'DA_DONG'"];
      const params = [];
      if (centerId != null) { where.push('t.center_id = ?');            params.push(centerId); }
      if (from)             { where.push('substr(t.closed_at,1,10) >= ?'); params.push(from); }
      if (to)               { where.push('substr(t.closed_at,1,10) <= ?'); params.push(to); }
      return db.prepare(`SELECT COUNT(*) AS n FROM ticket t WHERE ${where.join(' AND ')}`).get(...params).n;
    },

    /** Phân bố số phản hồi theo từng mức điểm 1..5 (chỉ các mức có dữ liệu). */
    distribution(filters) {
      const s = scope(filters);
      return db.prepare(`
        SELECT s.score, COUNT(*) AS n
        ${FROM_SURVEY}
        WHERE ${ANSWERED}${s.sql}
        GROUP BY s.score ORDER BY s.score`).all(...s.params);
    },

    /** UC4: thống kê theo từng kỹ thuật viên (phiếu chưa gán KTV bị bỏ qua nhờ INNER JOIN). */
    byTechnician(filters) {
      const s = scope(filters);
      return db.prepare(`
        SELECT tech.technician_id, tech.full_name, tech.level,
               COUNT(*) AS total_responses,
               SUM(CASE WHEN s.score >= 4 THEN 1 ELSE 0 END) AS high_count,
               SUM(CASE WHEN s.score <= 2 THEN 1 ELSE 0 END) AS low_count,
               AVG(s.score) AS avg_score
        ${FROM_SURVEY_TECH}
        WHERE ${ANSWERED}${s.sql}
        GROUP BY tech.technician_id, tech.full_name, tech.level`).all(...s.params);
    },

    /** UC5: xu hướng theo tháng hoặc quý của một năm (lấy kỳ từ dim_date, KHÔNG nội suy kỳ trống). */
    trend({ granularity, year, centerId }) {
      const col = granularity === 'quarter' ? 'd.quarter' : 'd.month';
      const where = ['d.year = ?'];
      const params = [year];
      if (centerId != null) { where.push('t.center_id = ?'); params.push(centerId); }
      return db.prepare(`
        SELECT ${col} AS period, COUNT(*) AS total_responses,
               SUM(CASE WHEN s.score >= 4 THEN 1 ELSE 0 END) AS high_count,
               AVG(s.score) AS avg_score
        ${FROM_SURVEY}
        JOIN dim_date d ON d.date_id = s.responded_date
        WHERE ${ANSWERED} AND ${where.join(' AND ')}
        GROUP BY ${col} ORDER BY ${col}`).all(...params);
    },
  };
}

module.exports = { createReportRepository };
