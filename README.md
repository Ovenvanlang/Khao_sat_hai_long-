# Khảo sát hài lòng CSAT – Mekong Mobile (Luồng L8)

**Môn:** Chuyên đề tốt nghiệp 1 · Track SE  
**SVTH:** PHOUTTHAVONG KHANXAY – 237480201IS10  
**GVHD:** ThS. Nguyễn Minh Tân

---

## 1. Mô tả đề tài

Sau khi phiếu bảo hành chuyển sang trạng thái **ĐÃ ĐÓNG**, hệ thống tự tạo khảo sát hài lòng, khách hàng chấm điểm 1–5 kèm nhận xét, và quản lý trung tâm / ban giám đốc xem chỉ số CSAT theo trung tâm, kỹ thuật viên và thời gian; phản hồi điểm thấp được chuyển đến quản lý trung tâm để chủ động liên hệ khách.

---

## 2. Yêu cầu môi trường

- **Node.js** 20 LTS, npm 10+
- **SQLite 3** – tích hợp sẵn qua `better-sqlite3`, **không cần cài riêng**
- Biến môi trường: sao chép `.env.example` thành `.env` (`PORT=3000`, `DB_PATH=./data/csat.db`)

> **Ghi chú:** Dùng SQLite thay PostgreSQL trong môi trường dev (phương án dự phòng hợp lệ – xem TD-04 trong `docs/thay-doi-thiet-ke.md`). Chuyển PostgreSQL ở staging chỉ cần đổi driver và chuỗi kết nối.

### Cài đặt và chạy lần đầu

```bash
# 1. Cài thư viện
npm install

# 2. Tạo 6 bảng theo DDL BT1
npm run migrate

# 3. Nạp dữ liệu mẫu
npm run seed

# 4. Chạy server
npm start
```

## 3 Design Changelog (Nhật ký thay đổi thiết kế)

Bảng dưới đây ghi lại các quyết định điều chỉnh thiết kế dựa trên phản hồi từ Bài tập 1 (Buổi 8).

| Mã | Điểm phản hồi | Quyết định | Lý do | Ảnh hưởng |
| :--- | :--- | :---: | :--- | :--- |
| **TD-01** | DDL đặt `score NOT NULL`, nhưng UC1 cần tạo bản ghi `survey_response` ngay khi phiếu đóng (lúc đó khách chưa trả lời). Nếu `NOT NULL` thì không thể tạo bản ghi `DA_GUI`. | **SỬA** | Luồng nghiệp vụ gồm 2 bước tách biệt: UC1 tạo khảo sát (`status = DA_GUI`, `score = NULL`) → sau đó UC2 cập nhật `score` khi khách trả lời. Nếu ép `score NOT NULL` thì hai use case không thể tách rời. | Bỏ `NOT NULL` khỏi cột `score` và `responded_at` trong DDL. Thêm `CHECK` đồng bộ (`DA_GUI` → `score IS NULL`; `DA_TRA_LOI` → `score IS NOT NULL`). Cập nhật `erd.drawio` và `SRS` mục 4. |
| **TD-02** | Thiếu thông tin để biết khảo sát được gửi lúc nào và khách trả lời vào ngày nào; FR-05 (biểu đồ xu hướng theo tháng/quý) không tính được nếu chỉ có `responded_at` dạng TIMESTAMP. | **SỬA** | FR-05 cần gom nhóm theo tháng/quý. Cột `responded_date` (DATE) kết hợp cùng bảng `dim_date` giúp truy vấn `GROUP BY` tháng/quý dễ đọc và hiệu năng tốt hơn so với dùng hàm `strftime()` trên TIMESTAMP. | Thêm cột `sent_at` (TIMESTAMP) và `responded_date` (DATE) vào bảng `survey_response`. Bổ sung bảng `dim_date` và script sinh dữ liệu. Cập nhật `erd.drawio` và `SRS` mục 4. |
| **TD-03** | Nên tách địa chỉ thành bảng riêng để chuẩn hoá. | **GIỮ NGUYÊN** | Phạm vi luồng L8 chỉ cần số điện thoại khách để liên hệ (QT-15, FR-06); không có yêu cầu lưu hay hiển thị địa chỉ trong bất kỳ FR nào của luồng này. Việc tách bảng sẽ thêm một phép `JOIN` mà không mang lại lợi ích trong phạm vi hiện tại. | Không thay đổi ERD. Đã ghi chú lý do vào `SRS` mục 4.1. |
| **TD-04** | Sơ đồ kiến trúc ghi PostgreSQL nhưng DDL dùng cú pháp `AUTOINCREMENT` (chỉ có trong SQLite, không phải cú pháp chuẩn SQL). | **SỬA** | Môi trường phát triển cá nhân dùng SQLite để tránh phụ thuộc cài đặt (phương án dự phòng hợp lệ theo hướng dẫn Buổi 8). Tất cả câu lệnh SQL tương thích; nếu chuyển sang PostgreSQL chỉ cần thay driver và chuỗi kết nối. | Cập nhật sơ đồ kiến trúc ghi rõ "SQLite (dev) / PostgreSQL (prod)". Cập nhật `README` mục 2 và mục 6. |