'use client';

import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  // Initialize selected variant
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
    return product.images[Math.min(activeIndex, product.images.length - 1)];
  }, [product.images, activeIndex]);

  const related = useMemo(() => {
    return getRelatedProducts(product, 4);
  }, [product]);

  const reviews = useMemo(
    () => [
      {
        name: 'Khách hàng tinh tuyển',
        title: 'Chất liệu vượt mong đợi',
        text: 'Đường nét gọn gàng, hoàn thiện rất “đắt”. Đeo lên cảm giác nhẹ và thanh lịch.',
      },
      {
        name: 'D. Y.',
        title: 'Đúng tinh thần Dáng Ý',
        text: 'Không phô trương nhưng vẫn nổi bật. Mình rất thích sự tối giản có chủ đích.',
      },
      {
        name: 'Khách hàng VIP',
        title: 'Đóng gói tinh tế',
        text: 'Hộp và phụ kiện kèm theo đẹp, trải nghiệm mở hộp rất “luxury”.',
      },
    ],
    [],
  );

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
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-zinc-900">
              Trang chủ
            </Link>
          </li>
          <li className="text-zinc-400">/</li>
          <li>
            <Link href="/#products" className="hover:text-zinc-900">
              Bộ sưu tập
            </Link>
          </li>
          <li className="text-zinc-400">/</li>
          <li className="text-zinc-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div
            ref={imageWrapRef}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-100"
            onMouseMove={onMove}
            onMouseEnter={() => setLens((s) => ({ ...s, visible: true }))}
            onMouseLeave={() => setLens((s) => ({ ...s, visible: false }))}
          >
            <AnimatePresence mode="wait">
              {activeImage && (
                <motion.div
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
                </motion.div>
              )}
            </AnimatePresence>

            {activeImage && lens.visible ? (
              <div className="pointer-events-none absolute inset-0 hidden md:block">
                <div
                  className="absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/10 shadow-sm backdrop-blur"
                  style={{ left: lens.px, top: lens.py }}
                />
                <div
                  className="absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm"
                  style={{ left: lens.px, top: lens.py }}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '220% 220%',
                      backgroundPosition: `${lens.x}% ${lens.y}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={
                    "relative aspect-[3/4] overflow-hidden rounded-md border transition-colors " +
                    (idx === activeIndex
                      ? "border-zinc-900"
                      : "border-zinc-200 hover:border-zinc-400")
                  }
                  aria-label={`Xem ảnh ${idx + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="25vw" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <motion.h1
            className="font-serif text-3xl font-medium leading-tight tracking-tight text-zinc-950 md:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {product.name}
          </motion.h1>

          <motion.p
            className="mt-3 font-sans text-lg font-light text-zinc-700"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {selectedVariant ? formatCurrencyVND(selectedVariant.price) : formatCurrencyVND(product.price)}
          </motion.p>

          <div className="mt-8 space-y-3 text-zinc-700">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
              Dáng Ý — Chế tác thủ công
            </p>
            <p className="font-sans text-base leading-7">
              Mỗi thiết kế là lời hồi đáp cho tầm nhìn của Dáng Ý về vẻ đẹp vượt thời gian — nơi sự tiết chế trở thành dấu ấn, và từng chi tiết là một lời cam kết. {product.description}
            </p>
            <p className="font-sans text-base leading-7">
              Từ bản phác thảo đầu tiên đến lớp hoàn thiện cuối cùng, nghệ nhân của chúng tôi làm việc bằng sự chuẩn xác thầm lặng. Kết quả không chỉ là một món phụ kiện, mà là một câu chuyện bạn có thể mang theo — riêng tư, bền bỉ, và rất “bạn”.
            </p>
          </div>

          {product.hasVariants && selectedVariant && (
            <motion.div
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
            </motion.div>
          )}

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
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="inline-flex w-full items-center justify-center rounded-md bg-[#722F37] px-6 py-4 font-sans text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#4A1C21] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              {selectedVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
          </div>

          <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={
                  'rounded-full px-4 py-2 text-sm transition-colors ' +
                  (activeTab === 'reviews'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100')
                }
              >
                Đánh giá từ khách hàng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={
                  'rounded-full px-4 py-2 text-sm transition-colors ' +
                  (activeTab === 'care'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100')
                }
              >
                Hướng dẫn bảo quản
              </button>
            </div>

            {activeTab === 'reviews' ? (
              <div className="mt-6 grid gap-4">
                {reviews.map((r) => (
                  <div key={r.title} className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{r.name}</div>
                    <div className="mt-2 font-serif text-lg tracking-tight text-zinc-950">{r.title}</div>
                    <p className="mt-2 text-sm leading-7 text-zinc-700">{r.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3 text-sm leading-7 text-zinc-700">
                <div>
                  <span className="font-medium text-zinc-950">Lau chùi</span>: dùng khăn mềm, khô; tránh
                  hoá chất mạnh.
                </div>
                <div>
                  <span className="font-medium text-zinc-950">Cất giữ</span>: đặt trong hộp/bao vải để
                  hạn chế trầy xước.
                </div>
                <div>
                  <span className="font-medium text-zinc-950">Hạn chế</span>: tránh nước hoa/xịt tóc tiếp
                  xúc trực tiếp lên bề mặt.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Gợi ý</div>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-zinc-950">
                Sản phẩm liên quan
              </h2>
            </div>
            <Link href="/#products" className="text-sm text-zinc-600 hover:text-zinc-900">
              Xem tất cả →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
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
