# SRS – Luồng L8: Khảo sát hài lòng CSAT

**Dự án:** Smart CRM – Mekong Mobile · **Sinh viên:** PHOUTTHAVONG Khanxay · **MSSV:** 237480201IS10 · **Track:** SE
**Phiên bản:** 2 (cập nhật sau phản hồi BT1 – xem `docs/thay-doi-thiet-ke.md`)

---

## 1. Giới thiệu

### 1.1. Mục đích và phạm vi
Hệ thống thu thập phản hồi của khách sau khi phiếu bảo hành được đóng và tổng hợp chỉ số hài lòng CSAT theo trung tâm, kỹ thuật viên và thời gian. Giải quyết vấn đề **V7** của case study: không có kênh phản hồi sau bảo hành, khiếu nại chỉ được biết khi khách đăng lên mạng xã hội.

**Phạm vi một câu:** Sau khi phiếu bảo hành chuyển sang ĐÃ ĐÓNG, hệ thống tự tạo khảo sát, khách chấm điểm 1–5 kèm nhận xét, và quản lý trung tâm, ban giám đốc, marketing xem CSAT theo trung tâm, kỹ thuật viên và thời gian; phản hồi điểm thấp được chuyển đến quản lý trung tâm.

### 1.2. Ngoài phạm vi (WON'T)
- Không quản lý bán hàng/đơn hàng; không tiếp nhận, phân công, đóng phiếu (L2, L4) – chỉ đọc phiếu đã ĐÃ ĐÓNG.
- Không gửi khảo sát thật qua email/SMS/Zalo.
- Không tính NPS (thang 0–10) vì mô hình dữ liệu gốc dùng thang 1–5.
- Không phân loại cảm xúc nhận xét bằng AI/NLP (ý tưởng COULD, để giai đoạn sau).
- Không xử lý khiếu nại sau khi liên hệ khách; không SSO, không container hóa.

### 1.3. Thuật ngữ
| Thuật ngữ | Định nghĩa | Tên kỹ thuật |
|---|---|---|
| Khảo sát hài lòng | Phản hồi của khách sau khi phiếu được đóng, thang 1–5 kèm nhận xét | `survey_response` |
| Phiếu bảo hành | Yêu cầu bảo hành/sửa chữa có mã duy nhất và vòng đời trạng thái | `ticket` |
| CSAT (BS) | Tỷ lệ phản hồi đã trả lời có điểm ≥ 4 trên tổng phản hồi đã trả lời | `csat_percent` |
| Phản hồi điểm thấp (BS) | Phản hồi đã trả lời có điểm ≤ 2 | `score ≤ 2` |
| Mẫu chưa đủ tin cậy (BS) | Nhóm số liệu có dưới 5 phản hồi đã trả lời | – |

## 2. Các bên liên quan

| Vai trò | Nhiệm vụ | Hạn chế |
|---|---|---|
| Khách hàng | Mở liên kết khảo sát, chấm điểm và nhận xét | Mỗi phiếu khảo sát một lần (QT-10) |
| Quản lý trung tâm | Xem CSAT theo trung tâm/kỹ thuật viên, danh sách điểm thấp, nhận thông báo | Chỉ xem trung tâm mình (QT-14); thấy số điện thoại đầy đủ (QT-15) |
| Ban giám đốc | Xem CSAT toàn công ty, xu hướng, danh sách điểm thấp | Chỉ xem |
| Marketing | Xem xu hướng CSAT (UC5) | Chỉ xem số liệu tổng hợp, không xem thông tin định danh (QT-15) |
| Hệ thống | Tạo khảo sát khi phiếu đóng; phát thông báo điểm thấp | Không tạo cho phiếu chưa đóng/đã có khảo sát |

## 3. Yêu cầu chức năng

| Mã | Yêu cầu | MoSCoW | Trạng thái (buổi 8) |
|---|---|---|---|
| FR-01 | Tự tạo khảo sát (DA_GUI) khi phiếu chuyển sang ĐÃ ĐÓNG; mỗi phiếu tối đa một | MUST | ✅ `POST /api/surveys` |
| FR-02 | Tiếp nhận phản hồi: điểm 1–5 bắt buộc, nhận xét ≤ 500 ký tự | MUST | ✅ `POST /api/surveys/:ticketId` |
| FR-03 | Báo cáo CSAT theo trung tâm theo khoảng thời gian; cảnh báo khi < 5 phản hồi | MUST | ⏳ khung route 501 |
| FR-04 | Báo cáo CSAT theo kỹ thuật viên, xếp CSAT giảm dần | MUST | ⏳ khung route 501 |
| FR-05 | Biểu đồ xu hướng CSAT theo tháng/quý, kỳ thiếu dữ liệu để trống | SHOULD | ⏳ |
| FR-06 | Danh sách phản hồi điểm thấp (≤ 2) | SHOULD | 🟡 lọc `score_max=2` đã có |
| FR-07 | Thông báo trong ứng dụng cho quản lý khi có điểm ≤ 2 | SHOULD | ⏳ (đã có cờ `low_score`) |

## 4. User Story (7)

| Mã | User Story | MoSCoW |
|---|---|---|
| US1 | Là hệ thống, tôi muốn tự tạo khảo sát ngay khi phiếu chuyển sang ĐÃ ĐÓNG để mọi phiếu hoàn tất đều được hỏi ý kiến mà không cần nhân viên nhớ gửi. | MUST |
| US2 | Là khách hàng, tôi muốn chấm điểm 1–5 và viết nhận xét ngắn trên một biểu mẫu đơn giản để phản hồi nhanh bằng điện thoại thay vì đăng lên mạng xã hội. | MUST |
| US3 | Là quản lý trung tâm, tôi muốn xem CSAT của trung tâm mình theo khoảng thời gian để biết chất lượng dịch vụ đang tốt lên hay xấu đi. | MUST |
| US4 | Là quản lý trung tâm, tôi muốn xem CSAT theo từng kỹ thuật viên để ghi nhận người làm tốt và hỗ trợ người cần cải thiện. | MUST |
| US5 | Là ban giám đốc, tôi muốn xem xu hướng CSAT theo tháng/quý để theo dõi chất lượng dịch vụ toàn công ty. | SHOULD |
| US6 | Là quản lý trung tâm, tôi muốn xem danh sách phản hồi điểm thấp kèm số điện thoại để chủ động liên hệ khách trước khi họ phàn nàn trên mạng xã hội. | SHOULD |
| US7 | Là quản lý trung tâm, tôi muốn được thông báo ngay khi có phản hồi điểm thấp để xử lý sớm thay vì phải tự vào kiểm tra định kỳ. | SHOULD |

### Tiêu chí chấp nhận (Given – When – Then)
| Mã | Given | When – Then | Ngoại lệ |
|---|---|---|---|
| US1 | Phiếu chưa ĐÃ ĐÓNG, chưa có khảo sát | Khi phiếu ĐÃ ĐÓNG, tạo 1 `survey_response` (DA_GUI) | Đã có khảo sát: không tạo (QT-10); phiếu ĐÃ HỦY: không tạo |
| US2 | Khảo sát của phiếu ĐÃ ĐÓNG đang DA_GUI | Khi khách gửi điểm 1–5, lưu điểm, nhận xét, thời điểm, đổi sang DA_TRA_LOI | Điểm ngoài 1–5: lỗi; đã trả lời: từ chối |
| US3 | Có ≥ 1 phản hồi đã trả lời | Khi chọn trung tâm + khoảng thời gian, hiện tổng, CSAT %, điểm TB, phân bố | < 5 phản hồi: cảnh báo; không có: "Chưa có phản hồi"; trung tâm khác: 403 |
| US4 | Trung tâm có kỹ thuật viên có phản hồi | Hiện CSAT từng người, giảm dần | Chưa có phản hồi: "chưa đủ dữ liệu"; < 5: cảnh báo |
| US5 | Có phản hồi nhiều tháng | Vẽ biểu đồ CSAT theo kỳ | Kỳ không dữ liệu: để trống, không nội suy |
| US6 | Có phản hồi ≤ 2 | Hiện danh sách mới nhất trước | Không có: "Không có phản hồi cần xử lý"; vai trò khác: 403 |
| US7 | Vừa lưu khảo sát ≤ 2 điểm | Tạo thông báo cho quản lý của phiếu | Không xác định quản lý: ghi log, vẫn lưu phản hồi |

## 5. Yêu cầu phi chức năng

| Mã | Yêu cầu (có ngưỡng đo được) | Nhóm |
|---|---|---|
| NFR1 | Báo cáo CSAT với tối đa 10.000 phản hồi hiển thị ≤ 2 giây ở phân vị 95 | Hiệu năng |
| NFR2 | Form khảo sát tải ≤ 3 giây (p95, 4G) và dùng đủ chức năng ở màn hình ≥ 360 px | Hiệu năng / thiết bị |
| NFR3 | 100% yêu cầu ngoài phạm vi vai trò bị từ chối (403, QT-14); 100% số điện thoại hiển thị đúng quy tắc che (QT-15) | Bảo mật |
| NFR4 | 0 phiếu có hơn 1 khảo sát (UNIQUE `ticket_id`); 100% phản hồi đã trả lời có điểm 1–5; 0 phản hồi bị xóa vật lý (QT-13) | Toàn vẹn |
| NFR5 | Sẵn sàng ≥ 99% trong 08:00–20:00 mỗi tháng | Khả dụng |

## 6. Quy tắc nghiệp vụ

| Mã | Quy tắc | Áp dụng |
|---|---|---|
| QT-06 | Phiếu chỉ chuyển trạng thái theo vòng đời; khảo sát chỉ phát sinh sau ĐÃ ĐÓNG | FR-01 |
| QT-10 | Chỉ khảo sát phiếu ĐÃ ĐÓNG, mỗi phiếu một lần | FR-01, FR-02 |
| QT-13 | Không xóa vật lý; chỉ xóa mềm | `survey_response` |
| QT-14 | Nhân viên xem đơn vị mình; quản lý xem đơn vị phụ trách; BGĐ xem toàn công ty | FR-03 → FR-07 |
| QT-15 | Số điện thoại che (090****567) với mọi vai trò trừ Quản lý và BGĐ | FR-06 |
| BS-01 | CSAT % = phản hồi đã trả lời có điểm ≥ 4 ÷ tổng phản hồi đã trả lời × 100 (làm tròn 1 chữ số); DA_GUI không tính | FR-03, 04, 05 |
| BS-02 | < 5 phản hồi: cảnh báo "mẫu chưa đủ tin cậy"; không có: "Chưa có phản hồi" (không hiện 0%) | FR-03, 04 |
| BS-03 | Điểm ≤ 2 là điểm thấp; lưu phản hồi như vậy thì tạo thông báo cho quản lý của phiếu | FR-06, 07 |
| BS-04 | Trung tâm và kỹ thuật viên của khảo sát suy ra từ phiếu | FR-03, 04 |
| BS-05 | Marketing chỉ xem số liệu tổng hợp, không xem thông tin định danh (giả định, chờ xác nhận) | FR-05 |

## 7. Bảng truy vết

| FR | US | UC | MoSCoW | NFR | Quy tắc | Test case |
|---|---|---|---|---|---|---|
| FR-01 | US1 | UC1 | MUST | NFR4 | QT-06, QT-10 | `tests/survey.test.js` (UC1, QT-10) |
| FR-02 | US2 | UC2 | MUST | NFR2, NFR4 | QT-10, QT-13 | `tests/survey.test.js` (UC2, NFR4) |
| FR-03 | US3 | UC3 | MUST | NFR1, NFR3 | QT-14, BS-01, BS-02, BS-04 | BT3 |
| FR-04 | US4 | UC4 | MUST | NFR1, NFR3 | QT-14, BS-01, BS-02, BS-04 | BT3 |
| FR-05 | US5 | UC5 | SHOULD | NFR1 | QT-14, BS-01, BS-05 | BT3 |
| FR-06 | US6 | UC6 | SHOULD | NFR3 | QT-14, QT-15, BS-03 | `tests/survey.test.js` (QT-14, lọc điểm thấp) |
| FR-07 | US7 | UC7 | SHOULD | NFR3 | QT-14, BS-03 | BT3 |

---

## Phụ lục A – Hợp đồng API (khớp mã nguồn buổi 8)

Cơ chế vai trò mô phỏng bằng header (xem TD-09): `X-Role` ∈ `he_thong | quan_ly | bgd | marketing` (không gửi = khách hàng); `X-Center-Id` bắt buộc với `quan_ly`.
Mọi lỗi có dạng `{ "error": "<MA_LOI>", "message": "..." }`.

| Method & đường dẫn | Vai trò | Mô tả | Mã trả về |
|---|---|---|---|
| `POST /api/surveys` body `{ticket_id}` | `he_thong` | UC1: tạo khảo sát cho phiếu ĐÃ ĐÓNG | 201; 400; 403; 404; 409 `PHIEU_CHUA_DONG` / `DA_KHAO_SAT` |
| `GET /api/surveys/:ticketId` | công khai | Khách mở form; không lộ thông tin khách | 200; 404 |
| `POST /api/surveys/:ticketId` body `{score, comment?}` | công khai | UC2: gửi phản hồi | 200; 400; 404; 409 `DA_KHAO_SAT` |
| `GET /api/surveys?status=&center_id=&score_max=&page=&limit=` | `quan_ly`, `bgd` | Danh sách (số điện thoại đầy đủ theo QT-15); quản lý bị ép theo trung tâm mình | 200; 400; 403 |
| `DELETE /api/surveys/:ticketId` | `quan_ly`, `bgd` | Xóa mềm (QT-13) | 200; 403; 404 |
| `GET /api/reports/csat` | `quan_ly`, `bgd`, `marketing` | UC3–UC5 – **chưa hiện thực** | 501 `CHUA_HIEN_THUC` |
| `GET /api/reports/low-score` | `quan_ly`, `bgd` | UC6 – **chưa hiện thực** | 501 |

Ghi chú: số điện thoại chỉ xuất hiện ở danh sách dành cho Quản lý/BGĐ, nên được trả đầy đủ; endpoint công khai không bao giờ trả thông tin khách. Khi làm báo cáo cho Marketing (UC5) sẽ chỉ trả số liệu tổng hợp.
