// src/frontend/api/survey.api.js
import apiCall from './client.js';

export const surveyApi = {
  // UC2: Lấy thông tin phiếu để hiện Form
  getSurveyInfo: (ticketId) => apiCall(`/surveys/${ticketId}`),
  
  // UC2: Gửi phản hồi
  submitSurvey: (ticketId, body) => 
    apiCall(`/surveys/${ticketId}`, { method: 'POST', body: JSON.stringify(body) }),

  // UC3, UC4: Báo cáo CSAT theo trung tâm/kỹ thuật viên
  getCsatReport: (params) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/reports/csat?${qs}`);
  },

  // UC6: Danh sách phản hồi điểm thấp
  getLowScores: (centerId) => 
    apiCall(`/reports/low-score?center_id=${centerId}`),

  // UC5: Xu hướng CSAT theo thời gian
  getTrend: (params) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/reports/trend?${qs}`);
  }
};