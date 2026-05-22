<div align="center">
  <h1 align="center">🛍️ Dáng Ý Store - E-Commerce Platform</h1>
  <p align="center">
    <strong>Đồ án Giữa kỳ môn Lập trình Front-End | Đại học Lạc Hồng</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant Design" />
    <img src="https://img.shields.io/badge/Zustand-Bear-orange?style=for-the-badge" alt="Zustand" />
  </p>
</div>

---

> *"Sự kết hợp giữa hiệu năng Server-First của Next.js và trải nghiệm tương tác mượt mà phía Client."*

## 📖 Giới thiệu dự án

**Dáng Ý Store** là một giải pháp Front-end cho hệ thống bán lẻ trực tuyến, hướng đến tệp khách hàng Gen Z và dân văn phòng. Dự án giải quyết bài toán cân bằng giữa việc **Tối ưu hóa công cụ tìm kiếm (SEO)** thông qua Server-Side Rendering (SSR) và **Trải nghiệm tương tác thời gian thực (Real-time UX)**.

Luồng mua sắm được thiết kế liền mạch theo phễu chuyển đổi: từ khám phá danh mục, lọc sản phẩm động, tùy chọn biến thể phức tạp, đến quản lý giỏ hàng toàn cục (Global Cart).

---

## 👥 Đội ngũ Phát triển

| Vai trò | Thực hiện | Mô tả công việc |
| :--- | :--- | :--- |
| **Full Stack** | **Nguyễn Thị Như Ý** | Xây dựng kiến trúc Next.js, thiết kế UI/UX, tích hợp API Mocking và quản lý Global State (Zustand). |

---

## ✨ Chức năng cốt lõi (Core Features)

- ⚡ **Tối ưu SEO & Tốc độ tải:** Áp dụng kiến trúc React Server Components (RSC) cho Trang chủ và Trang chi tiết sản phẩm.
- 🛒 **Global Dynamic Cart:** Quản lý giỏ hàng bằng trạng thái toàn cục (Zustand) tích hợp dạng Drawer trượt, cho phép cập nhật tức thì mà không cần tải lại trang.
- 🔍 **Lọc & Tìm kiếm thông minh:** Bộ lọc `FilterBar` tương tác phía Client, mang lại cảm giác phản hồi nhanh chóng khi duyệt danh mục.
- 🎨 **Responsive 100%:** Hiển thị hoàn hảo và giữ nguyên tỷ lệ cấu trúc trên cả Mobile, Tablet và Desktop.

---

## 🛠 Công nghệ sử dụng

| Hạng mục | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 16 (App Router) | Xây dựng kiến trúc hệ thống, Routing, SSR/SSG. |
| **Ngôn ngữ** | TypeScript | Ràng buộc kiểu dữ liệu tĩnh, giảm thiểu lỗi runtime. |
| **UI & Styling** | Tailwind CSS v4, Ant Design 6 | Quản lý bố cục linh hoạt và sử dụng các component phức tạp. |
| **State Management**| Zustand | Quản lý trạng thái Giỏ hàng gọn nhẹ, tránh re-render thừa. |
| **API & Data** | Next.js Route Handlers | Thiết lập API Mock chuẩn RESTful (`/api/products`). |

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Localhost)

Để chạy dự án trên môi trường cục bộ, máy tính của bạn cần cài đặt sẵn **Node.js (>= 20.x)**.

**Bước 1: Clone mã nguồn về máy**
Bash
git clone [https://github.com/Nhu-Y-Nguyen-LHU/Dang-Y-Store.git]
cd Dang-Y-Store

Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
Bash
npm install

Bước 3: Khởi chạy máy chủ phát triển
Bash
npm run dev

Bước 4: Trải nghiệm ứng dụng
Mở trình duyệt web và truy cập vào địa chỉ: http://localhost:3000

🎥 Video Demo & Báo cáo
Video Hướng dẫn & Demo: https://drive.google.com/drive/folders/116KlrZRK0XaNkEDqD-qW8jzB3Yvuyvz3?usp=drive_link

Tài liệu báo cáo: File Word báo cáo giữa kỳ đính kèm trong hồ sơ nộp bài.

📦 Dang-Y-Store
 ┣ 📂 app
 ┃ ┣ 📂 (routes)          # Các trang chính (home, about, checkout)
 ┃ ┣ 📂 api               # Mock API (Route Handlers)
 ┃ ┣ 📂 products          # Danh sách sản phẩm
 ┃ ┃ ┗ 📂 [slug]          # Dynamic Route cho trang chi tiết
 ┃ ┣ 📜 layout.tsx        # Layout tổng
 ┃ ┗ 📜 page.tsx          # Trang chủ
 ┣ 📂 components          # React Components (Header, Footer, Card)
 ┣ 📂 store               # Zustand Store (useCartStore.ts)
 ┗ 📜 tailwind.config.ts  # Cấu hình UI