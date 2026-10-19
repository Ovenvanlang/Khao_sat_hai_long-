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

## 3 de