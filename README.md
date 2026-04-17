# Dáng Ý Store

Demo storefront E-commerce cho thương hiệu **Dáng Ý** (thời trang & phụ kiện cao cấp), xây dựng bằng **Next.js App Router**.

## Tính năng chính

- Trang chủ với khu vực khám phá sản phẩm + bộ lọc.
- Tìm kiếm gợi ý theo tên / danh mục / bộ sưu tập.
- Trang chi tiết sản phẩm: xem thông tin, thêm vào giỏ, wishlist.
- Giỏ hàng dạng drawer (Zustand persisted) + điều chỉnh số lượng.
- Wishlist.
- Bộ trang tĩnh: About / Contact / Policies.
- Trang Story scrollytelling: **GSAP + ScrollTrigger** (parallax so le + blur-to-clear).

## Công nghệ

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (v4) + SCSS modules
- Zustand (store giỏ hàng/wishlist)
- Framer Motion (micro-interactions)
- Lenis (smooth scroll)
- GSAP + ScrollTrigger (scrollytelling)

## Routes

- `/` — Trang chủ
- `/product/[slug]` — Chi tiết sản phẩm
- `/wishlist` — Danh sách yêu thích
- `/checkout` — Thanh toán
- `/story` — Scrollytelling demo
- `/about`, `/contact`, `/policies/*` — Trang thông tin

## Bắt đầu

Yêu cầu: Node.js 18+ (khuyến nghị 20+)

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Scripts

```bash
npm run dev     # chạy dev server
npm run build   # build production
npm run start   # chạy production server
npm run lint    # lint
```

## Ghi chú

- Ảnh sản phẩm demo nằm trong `public/images/products/`.
- Trang `/story` dùng GSAP ScrollTrigger và có tích hợp đồng bộ với Lenis để animation scrub chạy đúng theo scroll.
