'use client';

import { useMemo } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { getAllProducts } from '@/lib/products';
import { useWishlistStore } from '@/store/useWishlistStore';

export default function WishlistPage() {
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const allProducts = getAllProducts();

  const products = useMemo(() => {
    if (!hasHydrated) return [];
    const idSet = new Set(wishlistIds);
    return allProducts.filter((p) => idSet.has(p.id));
  }, [allProducts, hasHydrated, wishlistIds]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-3xl tracking-tight text-zinc-950">
          Yêu thích
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Những món đồ bạn đã lưu lại để cân nhắc.
        </p>
      </div>

      {!hasHydrated ? (
        <ProductGrid loading skeletonCount={8} />
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white/70 p-10 text-center">
          <p className="font-serif text-lg text-zinc-900">
            Chưa có món đồ nào trong danh sách yêu thích.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Hãy nhấn vào biểu tượng trái tim trên sản phẩm để lưu lại.
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
