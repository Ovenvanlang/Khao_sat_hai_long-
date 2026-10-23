# Khảo sát hài lòng CSAT – Smart CRM Mekong Mobile (Luồng L8)

Chuyên đề tốt nghiệp 1 · Track SE · PHOUTTHAVONG Khanxay – 237480201IS10 · GVHD: ThS. Nguyễn Minh Tân

## 1. Giới thiệu
Sau khi phiếu bảo hành chuyển sang **ĐÃ ĐÓNG**, hệ thống tạo khảo sát; khách chấm điểm 1–5 kèm nhận xét; quản lý trung tâm, ban giám đốc, marketing xem chỉ số CSAT theo trung tâm, kỹ thuật viên và thời gian. Giải quyết vấn đề V7 của case study.

Tài liệu: `docs/srs.md` (SRS), `docs/thay-doi-thiet-ke.md` (nhật ký thay đổi thiết kế), `docs/anh-xa-kien-truc.md`, sơ đồ `.drawio` và ảnh chụp màn hình trong `docs/`.

## 2. Yêu cầu môi trường
- Node.js **22.13 trở lên** (khuyến nghị 22 hoặc 24 LTS), npm 10 — kiểm tra bằng `node -v`
- SQLite 3 dùng qua module `node:sqlite` **có sẵn trong Node**: không cần cài máy chủ CSDL, không cần biên dịch thư viện (xem TD-12)
- Không cần Internet khi chạy: Chart.js được phục vụ từ `node_modules` qua `/vendor/chartjs`; kiểu dáng do `src/frontend/assets/giao-dien.css` tự định nghĩa (không dùng khung CSS ngoài – TD-18)
- Biến môi trường: xem `.env.example` (`PORT`, `DATABASE_FILE`, `AUTH_SECRET`, `TOKEN_TTL_HOURS`, `DEMO_PASSWORD`)
- Ghi chú: dùng SQLite thay PostgreSQL theo quyết định kiến trúc (lập luận 5, BT1 Chương 3) vì quy mô ghi nhỏ và dễ chạy lại. Nếu Node cũ hơn 22.13, chương trình báo lỗi rõ ràng; cách xử lý: cài Node mới hoặc sửa riêng `src/backend/db/connection.js` (nơi duy nhất biết về thư viện CSDL).

## 3. Cài đặt và chạy
Mỗi bước **một lệnh**, chạy lần lượt trong thư mục dự án (đã thử lại trên một bản clone mới – xem mục 7).

| # | Việc | Lệnh | Kết quả mong đợi |
|---|---|---|---|
| 1 | Tải mã nguồn | `git clone <đường-dẫn-repo> && cd Khao_sat_hai_long` | có thư mục dự án |
| 2 | Cài thư viện | `npm ci` | cài xong, **không** cần biên dịch native |
| 3 | Tạo tệp cấu hình | `cp .env.example .env` (Windows: `copy .env.example .env`) | có tệp `.env`; đổi `AUTH_SECRET` trước khi dùng thật |
| 4 | Tạo CSDL + dữ liệu mẫu | `npm run db:setup` | in số dòng từng bảng và 4 tài khoản demo |
| 5 | Chạy bộ test | `npm test` | `# tests 40 / # pass 40 / # fail 0` |
| 6 | Chạy thử trọn luồng | `npm run chay-luong` | `== TOÀN BỘ LUỒNG CHẠY XONG, KHÔNG CÓ BƯỚC NÀO THẤT BẠI ==` |
| 7 | Khởi động máy chủ | `npm start` | `API khảo sát CSAT chạy tại http://localhost:3000` |
| 8 | Mở giao diện | mở trình duyệt vào `http://localhost:3000` | trang chủ với 3 màn hình |

Lệnh phụ trợ:

```bash
npm run seed -- --reset              # nạp lại dữ liệu mẫu từ đầu
npm run import -- data/raw           # nạp dữ liệu THẬT từ bộ CSV của LMS (xem mục 6)
npm run dev                          # chạy có tự khởi động lại khi sửa mã
```

**Tài khoản demo** (do `npm run db:setup` tạo; mật khẩu lấy từ `DEMO_PASSWORD` trong `.env`, mặc định `Demo@2026`):

| Tài khoản | Vai trò | Thấy được gì |
|---|---|---|
| `bgd` | Ban giám đốc | toàn hệ thống, mọi báo cáo |
| `quanly.hcm01` | Quản lý trung tâm | chỉ trung tâm mình (QT-14) |
| `marketing` | Marketing | chỉ số liệu tổng hợp, không xem chi tiết kỹ thuật viên/khách hàng (BS-05) |
| `hethong` | Tác nhân hệ thống | tạo khảo sát cho phiếu ĐÃ ĐÓNG (UC1) |

## 4. Cấu trúc thư mục
```
src/
  backend/                   # khối "Backend API" trong sơ đồ kiến trúc
    app.js, server.js        #   ráp các lớp và khởi động
    config/                  #   đọc biến môi trường
    middleware/              #   Access Middleware (đọc token, QT-14), xử lý lỗi
    routes/                  #   nhận/trả HTTP (auth, surveys, reports, centers)
    services/                #   quy tắc nghiệp vụ (auth, QT-10/13/14, BS-01…BS-05)
    repositories/            #   chỉ chứa SQL
    db/                      #   kết nối, migration, seed, nhập CSV
  frontend/                  # khối "Frontend"
    index.html, dang-nhap.html, khao-sat.html, bao-cao-csat.html, xu-huong.html
    assets/giao-dien.css     #   bộ nhận diện theo bản thiết kế wireframe
    api/                     #   client.mjs + *.api.mjs – NƠI DUY NHẤT gọi fetch
    components/              #   DataState, thanh bên, biểu đồ, định dạng số Việt Nam
    pages/                   #   mã của từng màn hình (không được gọi fetch trực tiếp)
scripts/                     # chạy trọn luồng end-to-end
tests/                       # test tự động (40 test)
docs/                        # SRS, sơ đồ .drawio, ảnh chụp màn hình, nhật ký thiết kế
```
Express phục vụ luôn `src/frontend/` ở cùng cổng với API, nên frontend gọi API bằng đường dẫn tương đối (`/api/...`), không cần CORS. Ánh xạ chi tiết với sơ đồ kiến trúc: `docs/anh-xa-kien-truc.md`.

### Quy ước frontend (bắt buộc)
- Trang trong `pages/` **không được gọi `fetch(`**; mọi lệnh gọi đi qua `api/client.mjs`. Có test tự động kiểm tra điều này.
- Mỗi vùng dữ liệu bọc trong **DataState**: luôn có 3 trạng thái *đang tải / không có dữ liệu / lỗi kèm nút **Thử lại***.
- Gặp HTTP 401, `client.mjs` xóa token và chuyển về `dang-nhap.html?ly_do=het_phien`.
- Thử nhanh: tắt máy chủ rồi bấm **Xem** trên trang báo cáo → hiện thông báo lỗi và nút **Thử lại**; bật lại máy chủ, bấm **Thử lại** → dữ liệu hiện ra (ảnh minh họa trong `docs/img/`).

## 5. API đã hiện thực
Đăng nhập trả về **token**; các lệnh gọi sau gửi kèm `Authorization: Bearer <token>` (thay cho header mô phỏng của buổi 8 – xem TD-14). Hợp đồng đầy đủ: `docs/srs.md` Phụ lục A.

| Endpoint | Vai trò | Việc làm |
|---|---|---|
| `POST /api/auth/login` `{"username","password"}` | công khai | đăng nhập, trả token + thông tin người dùng |
| `GET /api/auth/me` | đã đăng nhập | thông tin phiên hiện tại |
| `POST /api/surveys` `{"ticket_id":149}` | `he_thong` | UC1: tạo khảo sát cho phiếu ĐÃ ĐÓNG |
| `GET /api/surveys/:ticketId` | công khai | khách xem form khảo sát |
| `POST /api/surveys/:ticketId` `{"score":4,"comment":"..."}` | công khai | UC2: gửi phản hồi |
| `GET /api/surveys?status=&center_id=&score_max=&page=&limit=` | `quan_ly`, `bgd` | danh sách (quản lý chỉ thấy trung tâm mình) |
| `DELETE /api/surveys/:ticketId` | `quan_ly`, `bgd` | xóa mềm (QT-13) |
| `GET /api/reports/csat?center_id=&from=&to=` | `quan_ly`, `bgd`, `marketing` | UC3 + UC4: CSAT và bảng theo kỹ thuật viên |
| `GET /api/reports/trend?granularity=month\|quarter&year=&center_id=` | `quan_ly`, `bgd`, `marketing` | UC5: xu hướng theo thời gian |
| `GET /api/reports/low-score?center_id=&page=&limit=` | `quan_ly`, `bgd` | UC6: phản hồi điểm ≤ 2 |
| `GET /api/centers` | `quan_ly`, `bgd`, `marketing` | danh sách trung tâm cho bộ lọc |

Ví dụ:
```bash
TOKEN=$(curl -s -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" \
        -d '{"username":"bgd","password":"Demo@2026"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).data.token")
curl -s -H "Authorization: Bearer $TOKEN" "localhost:3000/api/reports/csat?from=2026-01-01&to=2026-12-31"
curl -s -X POST localhost:3000/api/surveys/5 -H "Content-Type: application/json" -d '{"score":9}'
# HTTP 400  {"error":"DU_LIEU_KHONG_HOP_LE","message":"score phải là số nguyên từ 1 đến 5"}
curl -s localhost:3000/api/reports/csat
# HTTP 401  {"error":"CHUA_DANG_NHAP","message":"Cần đăng nhập để dùng chức năng này"}
```

Nhật ký hai lần chạy trọn luồng: `docs/ket-qua-chay-mau.txt`. Ảnh chụp màn hình: `docs/img/b10-*.png`.

## 6. Dữ liệu
- Mặc định `npm run db:setup` nạp **dữ liệu mô phỏng tái lập được** (seed = 42; 6 trung tâm, 38 kỹ thuật viên, 150 phiếu) – TD-10.
- Để chạy trên **bộ CSV thật của LMS**: tạo thư mục `data/raw/`, chép vào đó `service_centers.csv`, `technicians.csv`, `tickets_history.csv`, `survey_responses.csv` (`customers.csv` nếu có), rồi chạy:
  ```bash
  npm run import -- data/raw
  npm run chay-luong
  ```
  Script tự khớp tên cột thường gặp (`center_id/id`, `score/rating/diem`, `responded_at/response_date`…), bỏ qua và báo rõ các dòng không hợp lệ. `data/` không được commit (xem `.gitignore`).

## 7. Trạng thái (hết buổi 10 – Sprint 2)
- [x] Đăng nhập thật bằng token: mật khẩu băm scrypt, token HMAC-SHA256, hết hạn 8 giờ (TD-14)
- [x] UC1, UC2, danh sách, xóa mềm (QT-10, QT-13, QT-14, QT-15)
- [x] UC3–UC6: CSAT theo trung tâm, theo kỹ thuật viên, xu hướng tháng/quý, phản hồi điểm thấp (BS-01, BS-02, BS-03, BS-05)
- [x] Frontend dựng **đúng 3 bản thiết kế wireframe** (form khảo sát, Báo cáo CSAT, Xu hướng & điểm thấp) cộng trang đăng nhập – đối chiếu từng chi tiết ở `docs/anh-man-hinh.md`
- [x] DataState cho mọi vùng dữ liệu; 401 tự đưa về trang đăng nhập; `pages/` không có `fetch(`
- [x] 40 test tự động đạt (gồm test biên BS-02 và ngoại lệ token/đăng nhập)
- [x] Chạy trọn luồng end-to-end trên cả dữ liệu mô phỏng và dữ liệu nạp từ CSV, có nhật ký và ảnh màn hình
- [x] Mục 3 đã thử lại trên bản clone mới (`npm ci` → `npm run db:setup` → `npm test` → `npm start`)
- [ ] UC7 thông báo điểm thấp qua email/Zalo – **cắt khỏi phạm vi**, lý do ghi ở `docs/thay-doi-thiet-ke.md` (TD-16)
- [ ] Phân loại nhận xét (COULD) – chưa làm, ngoài phạm vi buổi 10
