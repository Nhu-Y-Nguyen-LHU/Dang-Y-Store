'use client';

import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, motion as motionImport } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductVariant } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { formatCurrencyVND } from '@/store/useCartStore';
import { getRelatedProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import VariantSelector from '@/components/products/VariantSelector';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts?: Product[]; // Mảng chứa sản phẩm liên quan từ Supabase
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  // Khởi tạo biến thể được lựa chọn mặc định
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    return product.variants && product.variants.length > 0 ? product.variants[0] : null;
  });

  const [activeTab, setActiveTab] = useState<'reviews' | 'care'>('reviews');

  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const [lens, setLens] = useState<{
    visible: boolean;
    x: number;
    y: number;
    px: number;
    py: number;
  }>({ visible: false, x: 50, y: 50, px: 0, py: 0 });

  const activeImage = useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return `/images/categories/${(product.category || 'default').toLowerCase().replace(/\s+/g, '-')}.jpg`;
    }
    return product.images[Math.min(activeIndex, product.images.length - 1)];
  }, [product.images, activeIndex, product.category]);

  // Hợp nhất sản phẩm liên quan từ DB hoặc dùng Mock làm dự phòng (fallback)
  const related = useMemo(() => {
    if (relatedProducts && relatedProducts.length > 0) {
      return relatedProducts;
    }
    return getRelatedProducts(product, 4);
  }, [product, relatedProducts]);

  const reviews = useMemo(
    () => [
      {
        name: 'Khách hàng tinh tuyển',
        title: 'Chất liệu vượt mong đợi',
        text: 'Đường nét gọn gàng, hoàn thiện rất “đắt”. Thiết kế mặc lên cực kỳ tôn dáng và thanh lịch.',
      },
      {
        name: 'Quỳnh Chi Nguyễn',
        title: 'Đúng tinh thần Dáng Ý',
        text: 'Không phô trương nhưng vẫn vô cùng nổi bật. Đường may gấm hoa tỉ mỉ, rất đáng tiền.',
      },
      {
        name: 'Khách hàng VIP',
        title: 'Đóng gói tinh tế',
        text: 'Hộp và phụ kiện kèm theo cực đẹp, trải nghiệm mở hộp sang trọng chuẩn các hãng cao cấp quốc tế.',
      },
    ],
    [],
  );

  // Xử lý kính lúp phóng to ảnh (Luxury Hover Zoom Effect)
  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = imageWrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const py = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    const x = (px / rect.width) * 100;
    const y = (py / rect.height) * 100;

    setLens({ visible: true, x, y, px, py });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14 animate-fade-in">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#722F37] transition-colors">
              Trang chủ
            </Link>
          </li>
          <li className="text-zinc-300">/</li>
          <li>
            <Link href="/products" className="hover:text-[#722F37] transition-colors">
              Sản phẩm
            </Link>
          </li>
          <li className="text-zinc-300">/</li>
          <li className="text-zinc-800 font-medium truncate max-w-[200px] md:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* 2. Chi tiết sản phẩm Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        
        {/* CỘT TRÁI: Gallery Hình ảnh & Hiệu ứng Kính Lúp (Glass Zoom) */}
        <div>
          <div
            ref={imageWrapRef}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-150/50 shadow-sm cursor-zoom-in"
            onMouseMove={onMove}
            onMouseEnter={() => setLens((s) => ({ ...s, visible: true }))}
            onMouseLeave={() => setLens((s) => ({ ...s, visible: false }))}
          >
            <AnimatePresence mode="wait">
              {activeImage && (
                <motionImport.div
                  key={activeImage}
                  className="absolute inset-0"
                  layoutId={`product-image-${product.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                >
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motionImport.div>
              )}
            </AnimatePresence>

            {/* Thấu kính Zoom tròn cao cấp */}
            {activeImage && lens.visible ? (
              <div className="pointer-events-none absolute inset-0 hidden md:block">
                <div
                  className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/85 bg-white/15 shadow-lg backdrop-blur-sm"
                  style={{ left: lens.px, top: lens.py }}
                />
                <div
                  className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-xl"
                  style={{ left: lens.px, top: lens.py }}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '240% 240%',
                      backgroundPosition: `${lens.x}% ${lens.y}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Hàng ảnh nhỏ bên dưới (Thumbnail Gallery) */}
          {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={
                    "relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all duration-200 " +
                    (idx === activeIndex
                      ? "border-[#722F37] scale-98 shadow-sm"
                      : "border-transparent hover:border-[#722F37]/45")
                  }
                  aria-label={`Xem ảnh ${idx + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="25vw" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: Thông tin mô tả & Mua hàng */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#722F37]/10 text-[#722F37] uppercase tracking-wider">
              {product.category || 'Mặc Định'}
            </span>
          </div>

          <motionImport.h1
            className="font-serif text-3xl font-bold leading-tight tracking-tight text-zinc-900 md:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {product.name}
          </motionImport.h1>

          <motionImport.p
            className="mt-3 font-serif text-2xl font-semibold text-[#722F37]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {selectedVariant ? formatCurrencyVND(selectedVariant.price) : formatCurrencyVND(product.price)}
          </motionImport.p>

          <div className="mt-8 space-y-4 text-zinc-65/95 border-t border-zinc-100 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#722F37]">
              DÁNG Ý — THIẾT KẾ CUNG ĐÌNH VIỆT
            </p>
            <p className="font-sans text-base leading-7">
              Mỗi thiết kế là lời hồi đáp cho tầm nhìn của Dáng Ý về vẻ đẹp vượt thời gian — nơi sự tiết chế trở thành dấu ấn, và từng đường kim mũi chỉ là một lời cam kết. {product.description}
            </p>
            <p className="font-sans text-base leading-7">
              Từ bản phác thảo đầu tiên đến lớp hoàn thiện cuối cùng, nghệ nhân của chúng tôi làm việc bằng sự chuẩn xác thầm lặng. Kết quả không chỉ là một trang phục, mà là một tác phẩm nghệ thuật bạn mang theo — sang quý, bền bỉ, mang đậm nét tinh tế Việt Nam.
            </p>
          </div>

          {/* Bộ Chọn Biến Thể Độc Quyền */}
          {product.hasVariants && selectedVariant && (
            <motionImport.div
              className="mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <VariantSelector
                product={product}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            </motionImport.div>
          )}

          {/* Nút Hành động Mua hàng */}
          <div className="mt-10">
            <button
              type="button"
              onClick={() => {
                addItem(product, 1, {
                  unitPrice: selectedVariant?.price ?? product.price,
                  stockLimit: selectedVariant?.stock ?? null,
                  variant: selectedVariant,
                });
                openCart();
              }}
              disabled={product.hasVariants && (!selectedVariant || selectedVariant.stock === 0)}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#722F37] px-8 py-4 font-sans text-sm font-semibold tracking-wide !text-white transition-all duration-300 hover:bg-[#521C22] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:w-auto cursor-pointer"
              style={{ color: '#ffffff' }}
            >
              {product.hasVariants && selectedVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
          </div>

          {/* Tabs Khách hàng đánh giá & Bảo quản */}
          <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={
                  'rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ' +
                  (activeTab === 'reviews'
                    ? 'bg-[#722F37] !text-white shadow-sm'
                    : 'bg-[#722F37]/60 hover:bg-[#722F37]/80 !text-white/90')
                }
                style={{ color: '#ffffff' }}
              >
                Đánh giá khách hàng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={
                  'rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ' +
                  (activeTab === 'care'
                    ? 'bg-[#722F37] !text-white shadow-sm'
                    : 'bg-[#722F37]/60 hover:bg-[#722F37]/80 !text-white/90')
                }
                style={{ color: '#ffffff' }}
              >
                Hướng dẫn bảo quản
              </button>
            </div>

            {activeTab === 'reviews' ? (
              <div className="mt-6 grid gap-4">
                {reviews.map((r) => (
                  <div key={r.title} className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">{r.name}</div>
                    <div className="mt-1.5 font-serif text-base font-semibold tracking-tight text-zinc-900">{r.title}</div>
                    <p className="mt-2 text-sm leading-6 text-zinc-65">{r.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3.5 text-sm leading-7 text-zinc-600">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-800">Lau chùi:</span>
                  <span>Chỉ sử dụng khăn ẩm mềm để lau bề mặt, tuyệt đối không chà xát hóa chất tẩy rửa mạnh.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-800">Cất giữ:</span>
                  <span>Đặt riêng sản phẩm trong túi vải bảo vệ đi kèm, bảo quản ở nơi khô ráo, thoáng mát.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-800">Hạn chế:</span>
                  <span>Tránh tiếp xúc trực tiếp nước hoa, dung dịch cồn mạnh và nhiệt độ cao lên các chi tiết dệt nổi.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sản phẩm liên quan */}
      {related.length > 0 ? (
        <section className="mt-20 border-t border-zinc-100 pt-16">
          <div className="flex items-baseline justify-between gap-6 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">Gợi ý riêng cho bạn</div>
              <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-zinc-900">
                Sản phẩm liên quan
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-[#722F37] hover:text-[#521C22] transition-colors">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {related.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
