# Gaming Center Management System (G4_SDN)

Hệ thống quản lý trung tâm game G4_SDN - một nền tảng toàn diện để quản lý máy tính, đặt chỗ, thanh toán và thông báo trong trung tâm game.

## 🚀 Cách Khởi Động Trang Web

### Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- MongoDB
- npm hoặc yarn

### 1. Cài đặt dependencies

```bash
# Cài đặt backend
cd backend
npm install

# Cài đặt frontend
cd ../client
npm install
```

### 2. Cấu hình cơ sở dữ liệu

Đảm bảo MongoDB đang chạy và cập nhật thông tin kết nối trong file `backend/config/db.js` nếu cần.

### 3. Khởi động server

```bash
# Terminal 1: Khởi động backend server
cd backend
npm start
# Server sẽ chạy tại http://localhost:9999

# Terminal 2: Khởi động frontend
cd ../client
npm start
# Frontend sẽ chạy tại http://localhost:3000
```

### 4. Truy cập trang web

Mở trình duyệt và truy cập: http://localhost:3000

## 📋 Chức Năng Chính

### 👤 Chức năng dành cho Người dùng

#### 1. **Quản lý Máy tính**
- Xem danh sách máy tính có sẵn theo phòng
- Thông tin chi tiết về cấu hình máy (CPU, GPU, RAM, SSD)
- Trạng thái máy: available, reserved, in-use

#### 2. **Đặt chỗ Máy tính**
- Đặt máy theo thời gian và phòng
- Chọn gói dịch vụ bổ sung
- Tính toán tự động chi phí
- Kiểm tra xung đột đặt chỗ

#### 3. **Quản lý Thanh toán**
- Xử lý thanh toán cho đặt chỗ
- Hỗ trợ nhiều phương thức: tiền mặt, thẻ, ví điện tử
- Lịch sử thanh toán

#### 4. **Trung tâm Thông báo**
- Xem thông báo cá nhân
- Thông báo tự động: xác nhận đặt chỗ, thanh toán thành công
- Đánh dấu đã đọc/xóa thông báo

#### 5. **Lịch sử Sử dụng**
- Theo dõi thời gian sử dụng máy
- Lịch sử đặt chỗ và thanh toán

### 👨‍💼 Chức năng dành cho Quản trị viên

#### 1. **Quản lý Máy tính**
- Thêm/sửa/xóa máy tính
- Cập nhật trạng thái máy
- Phân loại theo phòng

#### 2. **Quản lý Đặt chỗ**
- Xem tất cả đặt chỗ
- Xác nhận/hủy đặt chỗ
- Quản lý xung đột

#### 3. **Quản lý Thanh toán**
- Xem lịch sử thanh toán
- Xử lý hoàn tiền
- Báo cáo doanh thu

#### 4. **Quản lý Thông báo**
- Gửi thông báo thủ công
- Gửi thông báo hàng loạt
- Quản lý lịch sử thông báo

#### 5. **Quản lý Người dùng**
- Xem danh sách người dùng
- Quản lý tài khoản và số dư

## 🛠️ Công nghệ Sử dụng

### Backend
- **Node.js** với **Express.js**
- **MongoDB** với **Mongoose**
- **CORS** cho cross-origin requests
- **JWT** cho authentication (nếu có)

### Frontend
- **React.js** với **React Router**
- **Tailwind CSS** cho styling
- **Axios** cho API calls
- **React Hooks** cho state management

### Database
- **MongoDB** collections:
  - `users` - Thông tin người dùng
  - `computers` - Danh sách máy tính
  - `reservations` - Đặt chỗ
  - `payments` - Thanh toán
  - `notifications` - Thông báo
  - `usage_logs` - Lịch sử sử dụng

## 🔗 API Endpoints Chính

### Máy tính
- `GET /api/computers` - Lấy danh sách máy tính
- `GET /api/computers/:id` - Chi tiết máy tính
- `POST /api/computers` - Thêm máy tính mới
- `PUT /api/computers/:id` - Cập nhật máy tính
- `DELETE /api/computers/:id` - Xóa máy tính

### Đặt chỗ
- `GET /api/reservations` - Lấy danh sách đặt chỗ
- `POST /api/reservations` - Tạo đặt chỗ mới
- `PUT /api/reservations/:id` - Cập nhật đặt chỗ
- `DELETE /api/reservations/:id` - Xóa đặt chỗ

### Thanh toán
- `GET /api/payments` - Lấy lịch sử thanh toán
- `POST /api/payments/process` - Xử lý thanh toán

### Thông báo
- `GET /api/notifications` - Lấy tất cả thông báo
- `GET /api/notifications/user/:userId` - Thông báo của user
- `POST /api/notifications` - Tạo thông báo mới
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc
- `DELETE /api/notifications/:id` - Xóa thông báo

### Người dùng
- `GET /api/users` - Lấy danh sách người dùng

## 📱 Giao diện Người dùng

### Menu Chính
- **Trang chủ** - Tổng quan hệ thống
- **Thông tin máy** - Danh sách máy tính
- **Package** - Các gói dịch vụ
- **Đặt chỗ** - Đặt máy tính
- **Tài khoản** - Quản lý tài khoản người dùng
- **Thanh toán** - Xử lý thanh toán
- **Lịch sử** - Lịch sử sử dụng
- **Thông báo** - Trung tâm thông báo

### Admin Panel
- `/admin/notifications` - Quản lý thông báo

## 🔧 Cấu trúc Dự án

```
G4_SDN/
├── backend/                 # Server-side code
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── scripts/           # Database seeding
├── client/                 # Frontend React app
│   ├── public/            # Static files
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   └── layout/        # Layout components
│   └── package.json
└── README.md
```

## 📊 Use Cases Đã Triển khai

### UC-01: Quản lý Máy tính
### UC-02: Đặt chỗ Máy tính
### UC-03: Xử lý Thanh toán
### UC-04: Quản lý Người dùng
### UC-08: Quản lý Thông báo ✅ **Đã hoàn thành**

## 🚀 Tính năng Đặc biệt

- **Thông báo Tự động**: Hệ thống tự động gửi thông báo khi có đặt chỗ hoặc thanh toán
- **Giao diện Responsive**: Tương thích với mobile và desktop
- **Real-time Updates**: Cập nhật trạng thái máy tính theo thời gian thực
- **Admin Dashboard**: Giao diện quản trị toàn diện
- **Notification Center**: Trung tâm thông báo cá nhân hóa

## 📞 Hỗ trợ

Nếu gặp vấn đề khi khởi động hoặc sử dụng hệ thống, vui lòng kiểm tra:
1. MongoDB đã được khởi động
2. Port 9999 và 3000 không bị chiếm
3. Dependencies đã được cài đặt đầy đủ
4. File cấu hình database chính xác

---

**Phiên bản:** 1.0.0
**Ngày cập nhật:** 13/11/2025
