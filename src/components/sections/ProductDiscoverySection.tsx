'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import ProductGrid from '@/components/products/ProductGrid';
import FilterBar, {
  type ProductFilters,
  type SortOption,
} from '@/components/products/FilterBar';

function getMaxPrice(products: Product[]) {
  return products.reduce((max, p) => Math.max(max, p.price), 0);
}

function applyFilters(products: Product[], filters: ProductFilters) {
  const q = filters.query.trim().toLowerCase();
  const selectedCollections = new Set(filters.collections);
  const selectedMaterials = new Set(filters.materials);

  const filtered = products.filter((p) => {
    if (q) {
      const haystack = `${p.name} ${p.category} ${p.collection}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (selectedCollections.size > 0 && !selectedCollections.has(p.collection)) {
      return false;
    }

    if (selectedMaterials.size > 0) {
      const match = p.materials?.some((m) => selectedMaterials.has(m));
      if (!match) return false;
    }

    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;

    return true;
  });

  const sort: SortOption = filters.sort;
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return filtered;
}

type ProductDiscoverySectionProps = {
  products: Product[];
};

export default function ProductDiscoverySection({
  products,
}: ProductDiscoverySectionProps) {
  const [loading, setLoading] = useState(true);

  const maxPrice = useMemo(() => getMaxPrice(products), [products]);

  const [filters, setFilters] = useState<ProductFilters>({
    query: '',
    collections: [],
    materials: [],
    priceMin: 0,
    priceMax: maxPrice,
    sort: 'newest',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceMax: Math.max(prev.priceMax, maxPrice),
    }));
  }, [maxPrice]);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return applyFilters(products, {
      ...filters,
      priceMax: Math.max(filters.priceMax, maxPrice),
    });
  }, [products, filters, maxPrice]);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h2 className="font-serif text-2xl tracking-tight text-zinc-950">
          Tuyển chọn của Dáng Ý
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Tìm đúng món đồ phù hợp với phong cách và khoảnh khắc của bạn.
        </p>
      </div>

      <FilterBar products={products} value={filters} onChange={setFilters} />

      <div className="mt-8">
        <ProductGrid products={filtered} loading={loading} skeletonCount={8} />
      </div>
    </section>
  );
}
