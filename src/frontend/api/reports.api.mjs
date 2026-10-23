// API báo cáo CSAT (ứng với routes/reports.routes.js).
import { request } from './client.mjs';

/** UC3 + UC4 – CSAT theo trung tâm kèm bảng theo kỹ thuật viên. */
export async function csat({ centerId, from, to } = {}) {
  const res = await request('/api/reports/csat', { query: { center_id: centerId, from, to } });
  return res.data;
}

/** UC5 – xu hướng theo tháng/quý. */
export async function trend({ centerId, granularity = 'month', year } = {}) {
  const res = await request('/api/reports/trend', { query: { center_id: centerId, granularity, year } });
  return res.data;
}

/** UC6 – danh sách phản hồi điểm thấp (<= 2). */
export async function lowScore({ centerId, page = 1, limit = 20 } = {}) {
  return request('/api/reports/low-score', { query: { center_id: centerId, page, limit } });
}

/** Danh sách trung tâm cho bộ lọc. */
export async function centers() {
  const res = await request('/api/centers');
  return res.data;
}
