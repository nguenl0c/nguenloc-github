# Kế hoạch phát triển Project Table/Board View (Clone GitHub Project)

## 1. Phân tích yêu cầu

- [x] Table View: Hiển thị danh sách task dạng bảng (giống GitHub Project)
- [x] Board View: Hiển thị task theo dạng Kanban (drag & drop giữa các cột trạng thái)
- [x] Các trường: Title, Assignees, Status, Priority, Estimate, Size, ...
- [x] Chuyển đổi giữa các view (Table/Board)
- [x] CRUD Task (thêm, sửa, xóa)
- [x] UI hiện đại, responsive, dùng Tailwind CSS

## 2. Cấu trúc thư mục dự kiến

```
src/
  components/
    TaskTable.jsx
    TaskBoard.jsx
    TaskForm.jsx
    TaskCard.jsx
    StatusColumn.jsx
    ...
  pages/
    Project.jsx
  data/
    tasks.js
  App.jsx
  main.jsx
```

## 3. Các bước thực hiện

- [ ] 1. Khởi tạo cấu trúc project, tạo file dữ liệu mẫu (tasks.js)
- [ ] 2. Xây dựng Table View
  - [ ] Hiển thị danh sách task dạng bảng
  - [ ] Có thể filter, sort, edit inline
- [ ] 3. Xây dựng Board View (Kanban)
  - [ ] Hiển thị task theo cột trạng thái
  - [ ] Hỗ trợ drag & drop (có thể dùng thư viện như `@dnd-kit/core` hoặc tự code)
- [ ] 4. Chuyển đổi giữa 2 view
  - [ ] Nút chuyển đổi Table/Board
- [ ] 5. CRUD Task
  - [ ] Thêm, sửa, xóa task (có thể dùng modal hoặc form riêng)
- [ ] 6. Tối ưu UI với Tailwind CSS
  - [ ] Responsive, dark mode, hiệu ứng đẹp
- [ ] 7. (Tuỳ chọn) Lưu dữ liệu vào localStorage hoặc backend

## 4. Ghi chú

- Ưu tiên code sạch, tách component rõ ràng
- Có thể mở rộng thêm các tính năng nâng cao sau khi hoàn thiện cơ bản
- Sử dụng React + Tailwind CSS
- Có thể tích hợp thêm các thư viện hỗ trợ drag & drop nếu cần

---

**Bắt đầu từ bước 1: Khởi tạo dữ liệu mẫu và Table View!**
