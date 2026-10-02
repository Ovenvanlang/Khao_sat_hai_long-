# SRS – Software Requirements Specification
## Luồng L8: Khảo sát hài lòng CSAT

**Dự án:** Smart CRM – Mekong Mobile (Case study)
**Sinh viên:** PHOUTTHAVONG Khanxay
**MSSV:** 237480201iss10
**Track:** SE
**Học phần:** Chuyên đề tốt nghiệp 1

---

## 1. Giới thiệu

### 1.1. Mục đích
Tài liệu này đặc tả yêu cầu phần mềm cho luồng nghiệp vụ **L8 – Khảo sát hài lòng CSAT**, thuộc hệ thống Smart CRM của Mekong Mobile. Mục tiêu là số hóa việc thu thập phản hồi khách hàng sau khi phiếu bảo hành được đóng, và tổng hợp chỉ số hài lòng (CSAT) theo nhiều chiều để hỗ trợ ra quyết định.

### 1.2. Phạm vi
Hệ thống giải quyết vấn đề **V7** (xem Bảng 2.2 – tài liệu case study): sau khi bảo hành xong, công ty không có kênh thu thập phản hồi, dẫn đến không biết khách hài lòng hay không — chỉ phát hiện qua khiếu nại trên mạng xã hội.

**Trong phạm vi:**
- Tự động tạo khảo sát khi ticket đóng
- Ghi nhận phản hồi của khách hàng (điểm 1–5, nhận xét)
- Báo cáo CSAT theo trung tâm, theo kỹ thuật viên, theo thời gian
- Lọc và cảnh báo phản hồi điểm thấp

**Ngoài phạm vi:**
- Không xây kênh gửi khảo sát thật qua email/SMS (mô phỏng bằng dữ liệu có sẵn)
- Không phân tích AI/NLP chuyên sâu cho nhận xét văn bản (chỉ ở mức COULD)
- Không xử lý nghiệp vụ tạo/đóng ticket (thuộc luồng L2, chỉ lấy ticket đã đóng làm đầu vào)
- Không làm chỉ số NPS theo chuẩn quốc tế (thang 0–10) vì không khớp với mô hình dữ liệu gốc (thang 1–5)

### 1.3. Thuật ngữ (trích từ Bảng 3.1 – case study)

| Thuật ngữ | Định nghĩa | Tên kỹ thuật |
|---|---|---|
| Khảo sát hài lòng | Phản hồi của khách sau khi phiếu được đóng, thang điểm 1–5 kèm nhận xét | survey_response |
| Phiếu bảo hành | Một yêu cầu bảo hành/sửa chữa, có mã duy nhất và vòng đời trạng thái | ticket |
| Kỹ thuật viên | Nhân viên thực hiện sửa chữa | technician |
| Trạng thái phiếu | Vị trí hiện tại của phiếu: Mới → Đã phân công → Đang xử lý → Chờ linh kiện → Hoàn tất → Đã đóng | ticket_status |

---

## 2. Mô tả tổng quan

### 2.1. Bối cảnh nghiệp vụ
Mekong Mobile có 6 trung tâm bảo hành, 38 kỹ thuật viên, xử lý trung bình 260 yêu cầu bảo hành/tháng. Hiện không có kênh thu thập phản hồi sau bảo hành — Marketing chỉ biết khách không hài lòng khi họ đăng lên mạng xã hội.

### 2.2. Actor

| Actor | Vai trò trong luồng |
|---|---|
| Khách hàng | Gửi phản hồi khảo sát sau khi nhận máy |
| Quản lý trung tâm | Xem báo cáo CSAT theo trung tâm/kỹ thuật viên, xử lý phản hồi điểm thấp |
| Ban giám đốc | Xem xu hướng CSAT toàn công ty theo thời gian |
| Marketing | Xem xu hướng CSAT, phân loại cảm xúc nhận xét (COULD) |
| Hệ thống | Tự động tạo khảo sát khi ticket đóng |

### 2.3. Luồng nghiệp vụ (một câu)
> Sau khi phiếu bảo hành được đóng, hệ thống tự động tạo khảo sát và gửi đến khách hàng, khách hàng phản hồi điểm hài lòng (1–5) kèm nhận xét, hệ thống tổng hợp chỉ số CSAT theo trung tâm – kỹ thuật viên – thời gian, và quản lý/ban giám đốc/marketing xem báo cáo để ra quyết định chăm sóc khách hàng.

---

## 3. Yêu cầu chức năng (Functional Requirements)

| Mã | Tên yêu cầu | Mô tả | Actor | Mức ưu tiên |
|---|---|---|---|---|
| FR-01 | Tạo khảo sát tự động | Hệ thống tự động sinh bản ghi survey_response (chưa có điểm) ngay khi ticket chuyển trạng thái ĐÃ ĐÓNG | Hệ thống | MUST |
| FR-02 | Gửi phản hồi khảo sát | Khách hàng gửi điểm (1–5) và nhận xét (tuỳ chọn) qua form khảo sát ứng với 1 ticket | Khách hàng | MUST |
| FR-03 | Xem báo cáo CSAT theo trung tâm | Hệ thống tính và hiển thị % CSAT trung bình theo từng trung tâm bảo hành | Quản lý trung tâm | MUST |
| FR-04 | Xem báo cáo CSAT theo kỹ thuật viên | Hệ thống tính và hiển thị % CSAT trung bình theo từng kỹ thuật viên | Quản lý trung tâm | MUST |
| FR-05 | Xem xu hướng CSAT theo thời gian | Hệ thống vẽ biểu đồ CSAT theo tháng/quý trong khoảng thời gian được chọn | Ban giám đốc, Marketing | SHOULD |
| FR-06 | Lọc phản hồi điểm thấp | Hệ thống lọc và hiển thị danh sách phản hồi có điểm ≤ 2, sắp theo thời gian gần nhất | Quản lý trung tâm | SHOULD |
| FR-07 | Phân loại cảm xúc nhận xét | Hệ thống gắn nhãn Tích cực/Tiêu cực/Trung lập cho nhận xét dạng văn bản tự do | Marketing | COULD |
| FR-08 | Gửi thông báo điểm thấp | Hệ thống tự động thông báo cho quản lý trung tâm khi phát sinh phản hồi điểm ≤ 2 | Quản lý trung tâm | SHOULD |

---

## 4. Yêu cầu phi chức năng (Non-Functional Requirements)

| Mã | Tên yêu cầu | Ngưỡng số / Tiêu chí đo được | Loại |
|---|---|---|---|
| NFR-01 | Hiệu năng tải báo cáo | Thời gian tải báo cáo CSAT ≤ 2 giây với tập dữ liệu 2.600 bản ghi survey_response | Performance |
| NFR-02 | Khả năng đáp ứng giao diện | Form khảo sát (FR-02) phải hiển thị và thao tác được bình thường trên màn hình ≥ 360px (responsive di động) | Usability |

---

## 5. Mô hình dữ liệu

Trích từ Mục 8 – Từ điển dữ liệu tham chiếu (case study), chỉ lấy các bảng liên quan đến L8.

### 5.1. survey_response — Phản hồi khảo sát hài lòng

| Cột | Kiểu dữ liệu | Ý nghĩa | Ràng buộc |
|---|---|---|---|
| response_id | BIGSERIAL | Khóa chính | PK |
| ticket_id | BIGINT | Phiếu được khảo sát | FK → ticket, NOT NULL, UNIQUE |
| score | SMALLINT | Điểm hài lòng 1–5 | NOT NULL, 1 ≤ score ≤ 5 |
| comment | TEXT | Nhận xét của khách | NULL được |
| responded_at | TIMESTAMP | Thời điểm trả lời | NOT NULL |

### 5.2. ticket — Phiếu bảo hành (rút gọn, chỉ cột liên quan)

| Cột | Kiểu dữ liệu | Ý nghĩa | Ràng buộc |
|---|---|---|---|
| ticket_id | BIGSERIAL | Khóa chính | PK |
| center_id | BIGINT | Trung tâm tiếp nhận | FK → service_center, NOT NULL |
| technician_id | BIGINT | Kỹ thuật viên được phân công | FK → technician, NULL được |
| status | VARCHAR(20) | Trạng thái hiện tại | NOT NULL |
| closed_at | TIMESTAMP | Thời điểm đóng phiếu | NULL được |

### 5.3. technician — Kỹ thuật viên (rút gọn)

| Cột | Kiểu dữ liệu | Ý nghĩa | Ràng buộc |
|---|---|---|---|
| technician_id | BIGSERIAL | Khóa chính | PK |
| center_id | BIGINT | Trung tâm làm việc | FK → service_center, NOT NULL |
| is_active | BOOLEAN | Còn làm việc hay không | NOT NULL, mặc định true |

### 5.4. dim_date — Chiều thời gian (tự sinh, không có trong dataset gốc)

| Cột | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| date_id | DATE | Khóa chính, mỗi dòng 1 ngày |
| month | SMALLINT | Tháng |
| quarter | SMALLINT | Quý |
| year | SMALLINT | Năm |

### 5.5. Quy tắc nghiệp vụ áp dụng (trích Mục 9 – case study)

| Mã | Nội dung | Áp dụng cho |
|---|---|---|
| QT-10 | Chỉ gửi khảo sát cho phiếu ở trạng thái ĐÃ ĐÓNG, mỗi phiếu chỉ khảo sát 1 lần | FR-01, FR-02 |
| QT-13 | Không xóa vật lý dữ liệu, chỉ soft-delete | survey_response |
| QT-14 | Nhân viên chỉ xem dữ liệu đơn vị mình; quản lý xem toàn đơn vị phụ trách; BGĐ xem toàn công ty | FR-03, FR-04, FR-05 |
| QT-15 | Số điện thoại khách hàng hiển thị dạng che (090****567) với mọi vai trò trừ Quản lý và BGĐ | FR-06 |

---

## 6. Ma trận truy vết (Traceability Matrix)

| User Story | FR tương ứng | Use Case tương ứng | Test case |
|---|---|---|---|
| US1 | FR-01 | UC1 | *(để trống – thực hiện ở BT3)* |
| US2 | FR-02 | UC2 | *(để trống – thực hiện ở BT3)* |
| US3 | FR-03 | UC3 | *(để trống – thực hiện ở BT3)* |
| US4 | FR-04 | UC4 | *(để trống – thực hiện ở BT3)* |
| US5 | FR-05 | UC5 | *(để trống – thực hiện ở BT3)* |
| US6 | FR-06 | UC6 | *(để trống – thực hiện ở BT3)* |
| US7 | FR-07 | UC7 | *(để trống – thực hiện ở BT3)* |
| US8 | FR-08 | UC8 | *(để trống – thực hiện ở BT3)* |

---

## Phụ lục A — User Story đầy đủ (8 story, kèm tiêu chí GWT)

**US1 (MUST).** Là hệ thống, tôi muốn tự động tạo phiếu khảo sát ngay khi ticket chuyển trạng thái "ĐÃ ĐÓNG" để thu thập phản hồi kịp thời.
- *Given* ticket đang ở trạng thái khác "ĐÃ ĐÓNG"
- *When* ticket chuyển sang "ĐÃ ĐÓNG"
- *Then* hệ thống tự tạo 1 bản ghi survey_response (chưa có điểm) liên kết ticket_id đó
- *Ngoại lệ:* Nếu ticket đã có survey_response → không tạo thêm (QT-10)

**US2 (MUST).** Là khách hàng, tôi muốn gửi phản hồi (điểm 1–5, nhận xét) qua biểu mẫu khảo sát đơn giản.
- *Given* khách nhận được khảo sát ứng với ticket đã đóng
- *When* khách chọn điểm (1–5) và gửi
- *Then* hệ thống lưu score + comment + responded_at
- *Ngoại lệ:* Nếu điểm ngoài khoảng 1–5 hoặc bỏ trống → từ chối lưu, báo lỗi

**US3 (MUST).** Là quản lý trung tâm, tôi muốn xem chỉ số CSAT trung bình theo từng trung tâm để đánh giá chất lượng dịch vụ.
- *Given* có ≥1 survey_response thuộc trung tâm đó
- *When* quản lý mở màn hình báo cáo và chọn trung tâm
- *Then* hệ thống hiển thị % CSAT = (số phản hồi điểm ≥4 / tổng phản hồi) × 100%
- *Ngoại lệ:* Nếu số phản hồi < 5 → hiển thị cảnh báo "mẫu chưa đủ tin cậy"

**US4 (MUST).** Là quản lý trung tâm, tôi muốn xem chỉ số hài lòng theo từng kỹ thuật viên để đánh giá hiệu quả xử lý.
- *Given* kỹ thuật viên đã xử lý ≥1 ticket có phản hồi khảo sát
- *When* quản lý chọn xem theo kỹ thuật viên
- *Then* hệ thống hiển thị CSAT riêng cho từng kỹ thuật viên, sắp theo điểm giảm dần
- *Ngoại lệ:* Kỹ thuật viên chưa có phản hồi nào → hiển thị "chưa đủ dữ liệu"

**US5 (SHOULD).** Là ban giám đốc/marketing, tôi muốn xem biểu đồ xu hướng chỉ số hài lòng theo thời gian (tháng/quý) để theo dõi biến động.
- *Given* có dữ liệu survey_response trải nhiều tháng
- *When* người dùng chọn khoảng thời gian
- *Then* hệ thống vẽ biểu đồ CSAT theo từng tháng/quý trong khoảng đó
- *Ngoại lệ:* Tháng không có dữ liệu → để trống (không nội suy)

**US6 (SHOULD).** Là quản lý trung tâm, tôi muốn lọc và xem danh sách phản hồi điểm thấp để chủ động liên hệ khách hàng.
- *Given* có survey_response với score ≤ 2
- *When* quản lý mở bộ lọc "điểm thấp"
- *Then* hệ thống hiển thị danh sách ticket + khách hàng + điểm + nhận xét, sắp theo thời gian gần nhất
- *Ngoại lệ:* Không có phản hồi nào ≤2 → hiển thị "không có cảnh báo"

**US7 (COULD).** Là marketing, tôi muốn hệ thống phân loại nhận xét dạng văn bản của khách (tích cực/tiêu cực) để hiểu vấn đề phổ biến trong trải nghiệm bảo hành.
- *Given* survey_response có comment không rỗng
- *When* hệ thống xử lý nhận xét
- *Then* gắn nhãn cảm xúc (Tích cực/Tiêu cực/Trung lập)
- *Ngoại lệ:* comment rỗng → bỏ qua, không gắn nhãn

**US8 (SHOULD).** Là quản lý trung tâm, tôi muốn nhận thông báo khi có phản hồi điểm thấp mới để xử lý ngay.
- *Given* một survey_response mới được lưu với score ≤ 2
- *When* hệ thống phát hiện bản ghi vừa lưu thỏa điều kiện
- *Then* gửi thông báo đến quản lý trung tâm tương ứng
- *Ngoại lệ:* Không xác định được quản lý phụ trách → ghi log cảnh báo, không gửi

---

## Phụ lục B — API Contract

### 1. GET /api/surveys/{ticket_id}
Lấy thông tin khảo sát (hoặc tạo mới nếu chưa có) cho 1 ticket.
Điều kiện: `ticket.status = "DA_DONG"` (QT-10)

```json
Response 200:
{
  "response_id": number,
  "ticket_id": number,
  "score": number | null,
  "comment": string | null,
  "responded_at": string | null
}
```
- `404`: ticket không tồn tại
- `409`: ticket chưa ở trạng thái ĐÃ ĐÓNG

### 2. POST /api/surveys/{ticket_id}
Khách hàng gửi phản hồi khảo sát.

```json
Request body:
{
  "score": number,     // bắt buộc, 1 <= score <= 5
  "comment": string    // tùy chọn
}
```
- `201`: tạo thành công
- `400`: score thiếu hoặc ngoài khoảng 1–5
- `409`: ticket_id đã có survey_response (vi phạm QT-10)

### 3. GET /api/reports/csat
Báo cáo CSAT tổng hợp theo bộ lọc. Chỉ Quản lý trung tâm và Ban giám đốc được gọi (QT-14).

```
Query params: center_id, technician_id, from, to (tất cả optional)
```
```json
Response 200:
{
  "total_responses": number,
  "csat_percent": number,
  "warning": string | null
}
```
- `403`: không đủ quyền truy vấn phạm vi yêu cầu

### 4. GET /api/reports/low-score
Danh sách phản hồi điểm thấp (score ≤ 2), chỉ Quản lý trung tâm.

```
Query params: center_id (optional), limit (optional, mặc định 20)
```
```json
Response 200:
[
  {
    "ticket_id": number,
    "customer_phone": string,  // dạng che: 090****567 (QT-15)
    "score": number,
    "comment": string | null,
    "responded_at": string
  }
]
```

---

*Tài liệu này tuân theo mô hình dữ liệu tham chiếu ở Mục 8 và quy tắc nghiệp vụ ở Mục 9 của tài liệu Case study Smart CRM – Mekong Mobile.*
