#!/usr/bin/env bash
# Chạy MỘT LẦN tại thư mục gốc của repo, sau khi đã `git init` (hoặc clone) và cấu hình git user.name/user.email.
# Tạo các commit theo đơn vị công việc, đúng quy ước Conventional Commits. Sau mỗi commit hệ thống vẫn chạy được.
# Xem lại bằng:  git log --oneline
set -euo pipefail
cd "$(dirname "$0")"
KEEP="src/backend/routes src/backend/services src/backend/repositories src/backend/middleware src/backend/db/migrations"

# 1) chặng 1: nhật ký thiết kế + SRS + sơ đồ gốc
git add docs/thay-doi-thiet-ke.md docs/srs.md docs/anh-xa-kien-truc.md docs/*.drawio docs/img
git commit -q -m "docs: điều chỉnh thiết kế theo phản hồi BT1"

# 2) chặng 2: khung dự án, thư mục src/backend và src/frontend theo sơ đồ kiến trúc
for d in $KEEP; do mkdir -p "$d"; touch "$d/.gitkeep"; git add "$d/.gitkeep"; done
git add package.json package-lock.json .gitignore .env.example src/frontend src/backend/config
git commit -q -m "chore: khung src/backend và src/frontend theo sơ đồ kiến trúc"

# 3) chặng 2–3: CSDL (migration theo DDL BT1 + seed)
git rm -q -f src/backend/db/migrations/.gitkeep
git add src/backend/db
git commit -q -m "feat: migration 001-002 theo DDL BT1 và seed dữ liệu mẫu"

# 4) chặng 3: module cốt lõi – CRUD survey_response qua 3 lớp
for d in src/backend/routes src/backend/services src/backend/repositories src/backend/middleware; do git rm -q -f "$d/.gitkeep"; done
git add src/backend
git commit -q -m "feat: CRUD survey_response qua routes/services/repositories"

# 5) test cho QT-10, QT-13, QT-14 và validate điểm
git add tests
git commit -q -m "test: ràng buộc UNIQUE ticket_id, xóa mềm, phân quyền theo trung tâm"

# 6) chặng 4: README + nhật ký chạy
git add README.md docs/ket-qua-chay-mau.txt
git commit -q -m "docs: README mục 2 và mục 6"

git log --oneline
