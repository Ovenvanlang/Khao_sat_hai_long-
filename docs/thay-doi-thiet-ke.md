# Nhật ký thay đổi thiết kế

## Sau phản hồi Bài tập 1 (buổi 8, ngày 19/10/2026)

### TD-01 Cho phép score = NULL khi khảo sát chưa được trả lời

- **Phản hồi của GV:** DDL đặt score NOT NULL, nhưng UC1 cần tạo bản ghi survey_response
  ngay khi phiếu đóng – lúc đó khách chưa trả lời nên score chưa có giá trị.
  Nếu NOT NULL thì không thể tạo bản ghi DA_GUI.
- **Quyết định:** SỬA
- **Lý do:** Luồng nghiệp vụ gồm 2 bước tách biệt:
  UC1 tạo khảo sát (status = DA_GUI, score = NULL) → sau đó
  UC2 cập nhật score khi khách trả lời.
  Nếu ép score NOT NULL thì hai use case không thể tách nhau.
- **Ảnh hưởng:** DDL survey_response: bỏ NOT NULL khỏi cột score và responded_at;
  thêm CHECK đồng bộ (DA_GUI → score IS NULL; DA_TRA_LOI → score IS NOT NULL);
  cập nhật erd.drawio và SRS mục 4.

---

### TD-02 Bổ sung cột sent_at và responded_date vào survey_response

- **Phản hồi của GV:** Thiếu thông tin để biết khảo sát được gửi lúc nào và khách
  trả lời vào ngày nào; FR-05 (biểu đồ xu hướng theo tháng/quý) không tính được
  nếu chỉ có responded_at dạng TIMESTAMP.
- **Quyết định:** SỬA
- **Lý do:** FR-05 cần gom nhóm theo tháng/quý; responded_date (DATE) kết hợp
  dim_date giúp truy vấn GROUP BY tháng/quý đọc được hơn và nhanh hơn
  hàm strftime() trên TIMESTAMP.
- **Ảnh hưởng:** Thêm cột sent_at TIMESTAMP và responded_date DATE vào
  survey_response; bổ sung bảng dim_date và script sinh bảng này;
  cập nhật erd.drawio và SRS mục 4.

---

### TD-03 Giữ nguyên không tách bảng địa chỉ cho customer

- **Phản hồi của GV:** Nên tách địa chỉ thành bảng riêng để chuẩn hoá.
- **Quyết định:** GIỮ NGUYÊN
- **Lý do:** Phạm vi L8 chỉ cần số điện thoại khách để liên hệ (QT-15, FR-06);
  không có yêu cầu lưu hay hiển thị địa chỉ trong bất kỳ FR nào của luồng này.
  Tách bảng sẽ thêm một JOIN mà không mang lại lợi ích nào trong phạm vi này.
  Nếu luồng khác cần địa chỉ sẽ mở rộng ở giai đoạn sau.
- **Ảnh hưởng:** Không thay đổi ERD. Đã ghi chú lý do vào SRS mục 4.1.

---

### TD-04 Dùng SQLite thay PostgreSQL trong môi trường phát triển

- **Phản hồi của GV:** Sơ đồ kiến trúc ghi PostgreSQL nhưng DDL dùng cú pháp
  AUTOINCREMENT (chỉ có trong SQLite, không phải cú pháp chuẩn SQL).
- **Quyết định:** SỬA (làm rõ trong tài liệu)
- **Lý do:** Môi trường phát triển cá nhân dùng SQLite để tránh phụ thuộc cài đặt
  (đây là phương án dự phòng hợp lệ theo hướng dẫn buổi 8). Tất cả câu lệnh SQL
  tương thích; nếu chuyển PostgreSQL chỉ thay driver và chuỗi kết nối.
- **Ảnh hưởng:** Cập nhật sơ đồ kiến trúc ghi rõ "SQLite (dev) / PostgreSQL (prod)";
  cập nhật README mục 2 và mục 6.
