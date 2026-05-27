<div align="center">
  <h1 align="center">🛍️ Dáng Ý Store - E-Commerce Platform</h1>
  <p align="center">
    <strong>Đồ án Tốt nghiệp / Cuối kỳ môn Lập trình Front-End nâng cao | Đại học Lạc Hồng</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-BaaS-active?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/NextAuth.js-4.x-violet?style=for-the-badge" alt="NextAuth" />
  </p>
</div>

---

> *"Sự kết hợp hoàn hảo giữa hiệu năng Server-First của Next.js, hệ thống Cơ sở dữ liệu Supabase BaaS mạnh mẽ và Cơ chế đồng bộ giỏ hàng thông minh bậc cao."*

## 📖 Giới thiệu Dự án

**Dáng Ý Store** là một ứng dụng Thương mại điện tử thời trang thuần Việt, tập trung tối đa vào trải nghiệm người dùng cao cấp (Premium UX), hiệu năng vượt trội và tính bảo mật cấp hệ thống. 

Trong giai đoạn cuối kỳ, dự án đã thực hiện bước nhảy vọt về mặt kỹ thuật: **Chuyển đổi hoàn toàn từ Mock dữ liệu tĩnh sang tích hợp đám mây Supabase BaaS real-time**, áp dụng cơ chế xác thực **NextAuth.js**, xử lý triệt để các trạng thái bất đồng bộ (**Suspense & Skeleton Streaming**), và phát triển thuật toán **Đồng bộ hóa giỏ hàng thông minh (Cart Merge Strategy)**.

---

## ✨ Điểm Sáng Kỹ Thuật (Technical Highlights)

*   ⚡ **Full-stack React Server Components (RSC):** Tải trước dữ liệu tĩnh trên Server, tối ưu hóa công cụ tìm kiếm (SEO) và tối đa hóa điểm hiệu năng **First Contentful Paint (FCP)**.
*   🔄 **BaaS Supabase Integration:** Đồng bộ thời gian thực bảng sản phẩm và giỏ hàng thông qua Rest API (PostgREST) được kiểm soát bởi cơ chế cache CDN nâng cao.
*   🚀 **React Suspense & Skeleton Streaming:** Tải phân đoạn dữ liệu, hiển thị bộ khung Skeleton nhấp nháy chuyên nghiệp bằng Tailwind CSS giúp giảm tỷ lệ thoát trang do cảm giác chờ đợi (Perceived Latency).
*   🔐 **Secure Authentication (NextAuth.js):** Xác thực an toàn thông qua Google OAuth và cơ chế Credentials lưu phiên không trạng thái (Stateless JWT).
*   🛒 **Smart Cart Merge (Custom Hook):** Thuật toán tự động cộng dồn giỏ hàng lưu trữ tạm thời (Zustand & LocalStorage) lên Cloud DB khi người dùng đăng nhập thành công, khống chế số lượng theo tồn kho thực tế (`stockLimit`).

---

## 🛠 Tech Stack Chi Tiết

| Phân nhóm | Công nghệ lựa chọn | Vai trò & Mục tiêu kiểm soát |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Xây dựng kiến trúc phân cấp trang, tối ưu hoá SSR và Server-side API. |
| **Cơ sở dữ liệu** | Supabase BaaS | Hệ quản trị cơ sở dữ liệu Postgres bảo mật, lưu trữ thông tin sản phẩm và giỏ hàng. |
| **Xác thực** | NextAuth.js | Quản lý phiên đăng nhập và định danh người dùng qua JWT/OAuth. |
| **State Manager**| Zustand | Quản lý trạng thái Giỏ hàng phía Client mượt mà, lưu vết tại LocalStorage. |
| **UI & Styling** | Tailwind CSS v4 & Ant Design | Thiết kế giao diện Glassmorphism cao cấp kết hợp các component UI phức tạp. |
| **Ngôn ngữ** | TypeScript | Kiểm soát chặt chẽ kiểu dữ liệu, triệt tiêu lỗi Runtime ẩn. |

---

## 📦 Cấu trúc Thư mục Dự án

```txt
my-app
┣ 📂 src
┃ ┣ 📂 app
┃ ┃ ┣ 📂 api                    # Thư mục chứa các API Route Handlers
┃ ┃ ┃ ┣ 📂 auth
┃ ┃ ┃ ┃ ┗ 📂 [...nextauth]      # Cấu hình NextAuth (Credentials & Google)
┃ ┃ ┃ ┗ 📂 products             # API GET lấy sản phẩm từ Supabase
┃ ┃ ┣ 📂 products               # Trang Danh sách sản phẩm
┃ ┃ ┃ ┣ 📂 [id]                 # Dynamic Route cho trang chi tiết
┃ ┃ ┃ ┣ 📜 loading.tsx          # Tailwind Skeleton Loader phân đoạn
┃ ┃ ┃ ┣ 📜 error.tsx            # Error Boundary phục hồi thông minh
┃ ┃ ┃ ┗ 📜 page.tsx             # Trang danh sách tích hợp Suspense
┃ ┃ ┣ 📜 layout.tsx             # Root Layout bao bọc Auth & UI Providers
┃ ┃ ┗ 📜 page.tsx               # Trang chủ Dáng Ý Store
┃ ┣ 📂 components               # Các thành phần tái sử dụng (Header, Card, Skeletons)
┃ ┣ 📂 hooks                    # Custom Hooks (useCartSync, useHasHydrated)
┃ ┣ 📂 lib                      # Cấu hình thư viện kết nối (Supabase Client, utils)
┃ ┣ 📂 store                    # Quản lý State toàn cục bằng Zustand (useCartStore)
┃ ┣ 📂 types                    # Khai báo kiểu dữ liệu tĩnh của TypeScript
┃ ┗ 📂 styles                   # Chứa CSS & SCSS tùy biến
┣ 📜 .env.local                 # File cấu hình biến môi trường cục bộ (Bảo mật)
┗ 📜 package.json               # Quản lý các gói phụ thuộc dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử (Localhost)

Yêu cầu môi trường tối thiểu: **Node.js phiên bản >= 20.x** và **NPM >= 10.x**.

### Bước 1: Tải mã nguồn về máy cục bộ
```bash
git clone https://github.com/your-username/Dang-Y-Store.git
cd Dang-Y-Store/my-app
```

### Bước 2: Cài đặt toàn bộ các thư viện phụ thuộc
```bash
npm install
```

### Bước 3: Cấu hình tệp biến môi trường `.env.local`
Tạo file `.env.local` tại thư mục gốc của dự án `my-app/` và nhập thông tin kết nối sau:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXTAUTH_SECRET=dang-y-store-secret-key-2026
```

### Bước 4: Chạy dự án ở chế độ Phát triển (Dev Mode)
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ: [http://localhost:3000](http://localhost:3000)

### Bước 5: Kiểm tra tính an toàn của TypeScript trước khi Deploy
```bash
npx tsc --noEmit
```

---

## 👥 Tác giả & Người thực hiện
*   **Thực hiện:** Nguyễn Thị Như Ý
*   **Đề tài:** Phát triển giao diện Front-End cho hệ thống thương mại điện tử Dáng Ý Store.
*   **Đơn vị:** Khoa Công nghệ thông tin - Đại học Lạc Lồng.