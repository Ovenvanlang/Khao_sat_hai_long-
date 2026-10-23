# Ánh xạ sơ đồ kiến trúc ↔ cấu trúc `src/`

Sơ đồ: `docs/img/hinh3-1_kien-truc.png` (nguồn `docs/kien-truc_L8.drawio`). Hai khối lớn của sơ đồ là **Frontend** và **Backend API** nên `src/` có đúng hai thư mục `frontend/` và `backend/`; mỗi lớp bên trong Backend có một thư mục riêng.

| Lớp trong sơ đồ kiến trúc | Thư mục / tệp | Trạng thái buổi 8 |
|---|---|---|
| Frontend (HTML/CSS/JS + Bootstrap + Chart.js) | `src/frontend/` | Khung giữ chỗ `index.html`; làm ở buổi 9–10 |
| Backend API – Express | `src/backend/app.js` (ráp các lớp), `src/backend/server.js` (khởi động) | ✅ chạy được |
| Access Middleware (QT-14, QT-15) | `src/backend/middleware/access.js` (+ `error-handler.js`) | ✅ vai trò mô phỏng bằng header (TD-09) |
| Routes (nhận/trả HTTP) | `src/backend/routes/surveys.routes.js`, `reports.routes.js` | ✅ surveys · ⏳ reports (khung 501) |
| Survey Service (UC1, UC2, UC7) | `src/backend/services/survey.service.js` | ✅ UC1, UC2; ⏳ UC7 (đã có cờ `low_score`) |
| Report Service (UC3–UC6) | `src/backend/services/report.service.js` | ⏳ khung |
| Repositories (chỉ SQL) | `src/backend/repositories/survey.repository.js`, `ticket.repository.js` | ✅ |
| SQLite (survey_response, ticket, technician, customer, service_center, dim_date) | `src/backend/db/` – `connection.js`, `migrate.js`, `migrations/001_schema.sql`, `002_indexes.sql`, `seed.js`; tệp dữ liệu `data/*.db` (không commit) | ✅ |
| CSV mẫu → script import | `data/raw/` (không commit) | ⏳ chưa nạp (TD-10) |

## Quy tắc phụ thuộc giữa các lớp
`routes` → `services` → `repositories` → CSDL. Lớp trên chỉ gọi lớp ngay dưới; routes **không** chứa SQL, repositories **không** chứa quy tắc nghiệp vụ, services **không** biết gì về HTTP (nhận/trả dữ liệu thuần và ném `AppError` có mã).

## Vì sao chia như vậy
- Quy tắc QT-10, QT-13, QT-14 nằm ở **một chỗ** (service), nên test được không cần dựng HTTP.
- Đổi cơ chế xác thực (TD-09) chỉ sửa `backend/middleware/access.js`.
- Đổi SQLite → PostgreSQL chỉ sửa `backend/db/connection.js` và các câu SQL trong `repositories/`.
