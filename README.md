# Khảo sát hài lòng CSAT – Smart CRM Mekong Mobile (Luồng L8)

Chuyên đề tốt nghiệp 1 · Track SE · PHOUTTHAVONG Khanxay – 237480201IS10 · GVHD: ThS. Nguyễn Minh Tân

## 1. Giới thiệu
Sau khi phiếu bảo hành chuyển sang **ĐÃ ĐÓNG**, hệ thống tạo khảo sát; khách chấm điểm 1–5 kèm nhận xét; quản lý trung tâm, ban giám đốc, marketing xem chỉ số CSAT theo trung tâm, kỹ thuật viên và thời gian. Giải quyết vấn đề V7 của case study.
Tài liệu: `docs/srs.md` (SRS), `docs/thay-doi-thiet-ke.md` (nhật ký thay đổi thiết kế), `docs/anh-xa-kien-truc.md`, sơ đồ `.drawio` trong `docs/`.

## 2. Yêu cầu môi trường
- Node.js **22.13 trở lên** (khuyến nghị 22 hoặc 24 LTS), npm 10 — kiểm tra bằng `node -v`
- SQLite 3 dùng qua module `node:sqlite` **có sẵn trong Node**: không cần cài máy chủ CSDL, không cần biên dịch thư viện (xem TD-12)
- Biến môi trường: xem `.env.example` (`PORT`, `DATABASE_FILE`)
- Ghi chú: dùng SQLite thay PostgreSQL theo quyết định kiến trúc (lập luận 5, BT1 Chương 3) vì quy mô ghi nhỏ và dễ chạy lại. Nếu Node cũ hơn 22.13, chương trình báo lỗi rõ ràng; cách xử lý: cài Node mới hoặc sửa riêng file `src/db/connection.js` (nơi duy nhất biết về thư viện CSDL).

## 3. Cài đặt và chạy
```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run db:setup            # chạy migration + nạp dữ liệu mẫu (seed=42)
npm start                   # http://localhost:3000
npm test                    # 18 test tự động (CSDL trong bộ nhớ)
```
Nạp lại dữ liệu mẫu từ đầu: `npm run seed -- --reset`.

## 4. Cấu trúc thư mục
```
src/
  backend/                   # khối "Backend API" trong sơ đồ kiến trúc
    app.js, server.js        #   ráp các lớp và khởi động
    config/                  #   đọc biến môi trường
    middleware/              #   Access Middleware (vai trò, QT-14), xử lý lỗi
    routes/                  #   nhận/trả HTTP
    services/                #   quy tắc nghiệp vụ (QT-10, QT-13, QT-14, BS-03)
    repositories/            #   chỉ chứa SQL
    db/                      #   kết nối, migration, seed
  frontend/                  # khối "Frontend" (HTML/CSS/JS + Bootstrap; làm ở buổi 9–10)
tests/                       # test tự động
docs/                        # SRS, sơ đồ .drawio, ảnh, nhật ký thiết kế
```
Express phục vụ luôn `src/frontend/` ở cùng cổng với API, nên frontend gọi API bằng đường dẫn tương đối (`/api/...`), không cần CORS. Ánh xạ chi tiết với sơ đồ kiến trúc: `docs/anh-xa-kien-truc.md`.

## 5. API đã hiện thực (thử bằng curl hoặc Postman)
Vai trò được **mô phỏng** bằng header `X-Role` (`he_thong | quan_ly | bgd | marketing`, bỏ trống = khách) và `X-Center-Id` cho quản lý (xem TD-09). Hợp đồng đầy đủ: `docs/srs.md` Phụ lục A.

| Endpoint | Vai trò | Việc làm |
|---|---|---|
| `POST /api/surveys` `{"ticket_id":149}` | `he_thong` | UC1: tạo khảo sát cho phiếu ĐÃ ĐÓNG |
| `GET /api/surveys/:ticketId` | công khai | khách xem form khảo sát |
| `POST /api/surveys/:ticketId` `{"score":4,"comment":"..."}` | công khai | UC2: gửi phản hồi |
| `GET /api/surveys?status=&center_id=&score_max=&page=&limit=` | `quan_ly`, `bgd` | danh sách (quản lý chỉ thấy trung tâm mình) |
| `DELETE /api/surveys/:ticketId` | `quan_ly`, `bgd` | xóa mềm (QT-13) |

Ví dụ:
```bash
curl -s -X POST localhost:3000/api/surveys/5 -H "Content-Type: application/json" -d '{"score":9}'
# HTTP 400  {"error":"DU_LIEU_KHONG_HOP_LE","message":"score phải là số nguyên từ 1 đến 5"}
curl -s -H "X-Role: quan_ly" -H "X-Center-Id: 1" "localhost:3000/api/surveys?status=DA_TRA_LOI&limit=2"
```
Nhật ký một lần chạy đầy đủ 10 bước: `docs/ket-qua-chay-mau.txt`. Ảnh chụp kết quả chạy: lưu vào `docs/img/` (xem mục 6).

## 6. Trạng thái hiện tại (buổi 8)
- [x] Nhật ký thay đổi thiết kế (TD-01 → TD-13) và cập nhật SRS, `.drawio` theo phản hồi BT1
- [x] Khung `src/backend` và `src/frontend` ánh xạ đúng sơ đồ kiến trúc (TD-13)
- [x] Migration 001–002 tạo 6 bảng theo DDL BT1; seed mô phỏng (6 trung tâm, 38 kỹ thuật viên, 150 phiếu)
- [x] CRUD `survey_response` qua 3 lớp routes → services → repositories (UC1, UC2, danh sách, xóa mềm)
- [x] QT-10, QT-13, QT-14 đã hiện thực và có test (18/18 đạt, gồm 2 test tình huống đua cho QT-10)
- [ ] Chụp ảnh kết quả chạy trên máy (curl/Postman: một lệnh 200 và một lệnh 400) lưu vào `docs/img/`
- [ ] Nạp `service_centers.csv`, `technicians.csv` từ bộ dữ liệu LMS (đang dùng seed mô phỏng – TD-10)
- [ ] UC3–UC6: báo cáo CSAT theo trung tâm/kỹ thuật viên/thời gian (route đang trả 501)
- [ ] UC7: thông báo điểm thấp (đã có cờ `low_score`)
- [ ] Frontend form khảo sát và dashboard (buổi 9–10)
- [ ] Test cho BS-01 và BS-02 (cùng với báo cáo CSAT) – trước buổi 10
- Ghi chú: vai trò mô phỏng bằng header, chưa đăng nhập thật (TD-09).
