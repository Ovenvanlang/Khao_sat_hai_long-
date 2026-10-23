#!/usr/bin/env bash
# Chạy MỘT LẦN tại thư mục gốc của repo, sau khi đã `git init` và cấu hình git user.name/user.email.
# Tạo 12 commit theo đơn vị công việc, đúng quy ước Conventional Commits; sau mỗi commit hệ thống vẫn chạy được.
# Xem lại bằng:  git log --oneline
set -euo pipefail
cd "$(dirname "$0")"

TRAILER=$'\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01MzWXWQUgy19CZjEhUdaibK'
ghi() { git commit -q -m "$1$TRAILER"; }

KEEP="src/backend/routes src/backend/services src/backend/repositories src/backend/middleware src/backend/db/migrations"

# ---------------------------------------------------------------- Sprint 1 (buổi 8)
# 1) nhật ký thiết kế + SRS + sơ đồ gốc
git add docs/thay-doi-thiet-ke.md docs/srs.md docs/anh-xa-kien-truc.md docs/*.drawio
git add docs/img/hinh*.png
ghi "docs: điều chỉnh thiết kế theo phản hồi BT1"

# 2) khung dự án theo sơ đồ kiến trúc
for d in $KEEP; do mkdir -p "$d"; touch "$d/.gitkeep"; git add "$d/.gitkeep"; done
git add package.json package-lock.json .gitignore .env.example src/backend/config src/backend/errors.js
ghi "chore: khung src/backend và src/frontend theo sơ đồ kiến trúc"

# 3) CSDL: migration theo DDL BT1 + seed mô phỏng
git rm -q -f src/backend/db/migrations/.gitkeep
git add src/backend/db/migrations/001_schema.sql src/backend/db/migrations/002_indexes.sql
git add src/backend/db/connection.js src/backend/db/migrate.js src/backend/db/seed.js
ghi "feat: migration 001-002 theo DDL BT1 và seed dữ liệu mẫu"

# 4) module cốt lõi: CRUD survey_response qua 3 lớp
for d in src/backend/routes src/backend/services src/backend/repositories src/backend/middleware; do
  git rm -q -f "$d/.gitkeep"
done
git add src/backend/repositories/survey.repository.js src/backend/repositories/ticket.repository.js
git add src/backend/services/survey.service.js src/backend/middleware src/backend/routes/surveys.routes.js
git add src/backend/app.js src/backend/server.js
ghi "feat: CRUD survey_response qua routes/services/repositories"

# 5) test cho QT-10, QT-13, QT-14
git add tests/survey.service.test.js
ghi "test: ràng buộc UNIQUE ticket_id, xóa mềm, phân quyền theo trung tâm"

# ---------------------------------------------------------------- Sprint 2 (buổi 10)
# 6) đăng nhập thật bằng token (TD-14)
git add src/backend/db/migrations/003_users.sql src/backend/repositories/user.repository.js
git add src/backend/services/auth.service.js src/backend/routes/auth.routes.js
ghi "feat(auth): đăng nhập bằng token HMAC-SHA256, mật khẩu băm scrypt"

# 7) báo cáo CSAT UC3–UC6
git add src/backend/repositories/report.repository.js src/backend/repositories/center.repository.js
git add src/backend/services/report.service.js src/backend/routes/reports.routes.js
ghi "feat(reports): CSAT theo trung tâm, kỹ thuật viên, xu hướng và điểm thấp (BS-01, BS-02)"

# 8) lớp gọi API và component DataState của frontend
git add src/frontend/api src/frontend/components src/frontend/assets
ghi "feat(frontend): lớp api client và component DataState ba trạng thái"

# 9) các màn hình
git add src/frontend/index.html src/frontend/dang-nhap.html src/frontend/khao-sat.html
git add src/frontend/bao-cao-csat.html src/frontend/xu-huong.html src/frontend/pages
ghi "feat(frontend): bốn màn hình đăng nhập, khảo sát, báo cáo CSAT, xu hướng"

# 10) test bổ sung cho đăng nhập, báo cáo và giao diện
git add tests/auth.service.test.js tests/report.service.test.js tests/frontend.test.js tests/survey.test.js
ghi "test: biên BS-02, ngoại lệ token và kiểm tra pages không gọi fetch"

# 11) nhập CSV thật và script chạy trọn luồng
git add src/backend/db/import-csv.js scripts
ghi "feat(data): nhập CSV từ LMS và script chạy trọn luồng end-to-end"

# 12) tài liệu và ảnh chụp kết quả
git add README.md docs/ket-qua-chay-mau.txt docs/thay-doi-thiet-ke.md docs/srs.md docs/img commit-plan.sh
ghi "docs: README mục 3, nhật ký TD-14..TD-17 và ảnh chụp màn hình buổi 10"

git log --oneline
