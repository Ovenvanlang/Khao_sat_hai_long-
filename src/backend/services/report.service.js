// Khung cho Report Service (UC3–UC6). CHƯA hiện thực ở buổi 8 – xem README mục 6.
function createReportService() {
  return {
    csat() { throw Object.assign(new Error('Chưa hiện thực'), { status: 501, code: 'CHUA_HIEN_THUC' }); },
    lowScore() { throw Object.assign(new Error('Chưa hiện thực'), { status: 501, code: 'CHUA_HIEN_THUC' }); },
  };
}

module.exports = { createReportService };
