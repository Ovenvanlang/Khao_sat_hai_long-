# Ảnh chụp màn hình – Buổi 10 (Sprint 2)

Giao diện dựng **bám theo bản thiết kế wireframe của đồ án** (3 màn hình). Ảnh chụp trên bản chạy thật
(`npm start`, dữ liệu `npm run db:setup`, seed = 42). Tệp ảnh nằm trong `docs/img/`.

| Ảnh | Nội dung | Chứng minh yêu cầu |
|---|---|---|
| `b10-06_man-hinh-1-form-khao-sat.png` | **Màn hình 1** – form khảo sát của khách: dải đầu đỏ MEKONG MOBILE, thẻ phiếu bảo hành, 5 nút tròn 1–5, ô nhận xét có bộ đếm ký tự, nút "Gửi phản hồi" | UC2, bản thiết kế số 1 |
| `b10-07_khao-sat-chua-chon-diem.png` | Chưa chọn điểm mà bấm gửi → báo "Vui lòng chọn điểm 1–5" (không gọi máy chủ) | Ràng buộc bắt buộc chọn điểm |
| `b10-08_gui-phan-hoi-thanh-cong.png` | Gửi xong: ghi nhận điểm và khóa biểu mẫu | UC2, QT-10 |
| `b10-03_man-hinh-2-bao-cao-csat.png` | **Màn hình 2** – Quản lý trung tâm: thanh bên 4 mục, bộ lọc, 4 thẻ KPI, biểu đồ phân bố điểm, bảng kỹ thuật viên, hộp "Ghi chú thiết kế" | UC3, UC4, QT-14, bản thiết kế số 2 |
| `b10-05_bao-cao-toan-cong-ty-bgd.png` | Ban giám đốc xem toàn công ty: CSAT 90,0%, phân bố điểm (1–2 đỏ, 3–5 xanh), nhãn ⚠ n < 5 trên từng kỹ thuật viên | BS-01, BS-02 |
| `b10-04_man-hinh-3-xu-huong-diem-thap.png` | **Màn hình 3** – biểu đồ đường CSAT theo tháng (kỳ trống không nội suy) và bảng phản hồi điểm ≤ 2 kèm số điện thoại đầy đủ | UC5, UC6, BS-03, QT-15, bản thiết kế số 3 |
| `b10-01_trang-chu.png` | Trang chủ: lối vào 3 màn hình và danh sách tài khoản demo | Điều hướng chung |
| `b10-02_dang-nhap-sai-mat-khau.png` | Đăng nhập sai mật khẩu: báo lỗi tại chỗ, không chuyển trang | Đăng nhập thật |
| `b10-09_tat-backend-loi-va-nut-thu-lai.png` | **Tắt backend rồi bấm "Áp dụng"**: cả ba vùng dữ liệu hiện lỗi kèm nút "Thử lại" | Tiêu chí "xong khi" của đề |
| `b10-10_bam-thu-lai-tai-duoc-du-lieu.png` | Bật backend lại, bấm "Thử lại": dữ liệu hiển thị bình thường | DataState phục hồi sau lỗi |

## Đối chiếu với bản thiết kế

| Thành phần trong thiết kế | Hiện thực |
|---|---|
| Dải đầu đỏ, nút tròn 1–5, bộ đếm `58 / 500`, ghi chú QT-10 | đúng như thiết kế |
| Thanh bên tối: Tổng quan CSAT · Theo kỹ thuật viên · Xu hướng theo thời gian · Phản hồi điểm thấp | đúng; mục đang mở được tô đỏ, chân thanh hiện tên và phạm vi người đăng nhập |
| 4 thẻ KPI (CSAT xanh lá, Điểm trung bình, Tổng phản hồi, Điểm thấp đỏ) | đúng; số theo kiểu Việt Nam (`90,0%`, `4,43`) |
| Biểu đồ cột phân bố điểm, cột 1–2 đỏ, 3–5 xanh, có nhãn số | đúng |
| Bảng kỹ thuật viên xếp CSAT giảm dần, nhãn `⚠ n < 5` + ghi chú BS-02 | đúng |
| Biểu đồ đường CSAT theo tháng, kỳ trống để hở, ghi chú "không nội suy" | đúng |
| Bảng điểm thấp: Thời điểm · Mã phiếu · Kỹ thuật viên · Điểm · Nhận xét · SĐT | đúng |
| Hộp "Ghi chú thiết kế" màu xanh | giữ nguyên nội dung trong thiết kế |
| Dòng "Thiết bị: iPhone 15 Pro Max" trên thẻ phiếu | **không hiện thực**: ERD/DDL của BT1 không có bảng thiết bị, thêm cột chỉ để hiển thị sẽ lệch từ điển dữ liệu (ghi ở TD-18) |
| Ghi chú "phản hồi ≤ 2 điểm tạo thông báo cho Quản lý (UC7)" | giữ câu chữ nhưng ghi rõ "chưa hiện thực, xem TD-16" để không mô tả sai năng lực hệ thống |

Nhật ký chạy trọn luồng (hai bộ dữ liệu): `ket-qua-chay-mau.txt`.
