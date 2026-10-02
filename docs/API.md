### 1. GET /api/surveys/{ticket_id}
Lấy thông tin khảo sát (hoặc tạo mới nếu chưa có) cho 1 ticket.
Điều kiện: ticket.status = "DA_DONG" (QT-10)

Response 200:
{
  "response_id": number,
  "ticket_id": number,
  "score": number | null,       // 1-5, null nếu chưa phản hồi
  "comment": string | null,
  "responded_at": string | null // ISO timestamp
}

Response 404: ticket không tồn tại
Response 409: ticket chưa ở trạng thái ĐÃ ĐÓNG → "Khảo sát chưa khả dụng"


### 2. POST /api/surveys/{ticket_id}
Khách hàng gửi phản hồi khảo sát.

Request body:
{
  "score": number,     // bắt buộc, 1 <= score <= 5
  "comment": string     // tùy chọn
}

Response 201: tạo thành công, trả lại object survey_response đầy đủ
Response 400: score thiếu hoặc ngoài khoảng 1-5
Response 409: ticket_id đã có survey_response (vi phạm QT-10 — UNIQUE ticket_id)


### 3. GET /api/reports/csat
Báo cáo CSAT tổng hợp theo bộ lọc. Chỉ Quản lý trung tâm (xem đơn vị mình) 
và Ban giám đốc (xem toàn công ty) được gọi — theo QT-14.

Query params:
  center_id      (optional, FK -> service_center)
  technician_id  (optional, FK -> technician)
  from, to       (optional, ISO date, lọc theo responded_at)

Response 200:
{
  "total_responses": number,
  "csat_percent": number,      // (score>=4 / total) * 100
  "warning": string | null     // "mẫu chưa đủ tin cậy" nếu total_responses < 5
}

Response 403: không đủ quyền truy vấn phạm vi yêu cầu (QT-14)


### 4. GET /api/reports/low-score
Danh sách phản hồi điểm thấp (score <= 2), chỉ Quản lý trung tâm.

Query params:
  center_id (optional)
  limit     (optional, mặc định 20)

Response 200:
[
  {
    "ticket_id": number,
    "customer_phone": string,  // dạng che theo QT-15: 090****567
    "score": number,
    "comment": string | null,
    "responded_at": string
  }
]