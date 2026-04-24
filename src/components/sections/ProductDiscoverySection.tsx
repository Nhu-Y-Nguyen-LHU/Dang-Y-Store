'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import ProductGrid from '@/components/products/ProductGrid';
import FilterBar, {
  type ProductFilters,
  type SortOption,
} from '@/components/products/FilterBar';

function getMaxPrice(products: Product[]) {
  return products.reduce((max, p) => Math.max(max, p.price), 0);
}

function parseCsv(value: string | null) {
  if (!value) return [] as string[];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFiltersFromSearchParams(
  params: URLSearchParams,
  maxPrice: number,
): ProductFilters {
  const sortParam = params.get('sort');
  const sort: SortOption =
    sortParam === 'price-asc' || sortParam === 'price-desc' || sortParam === 'newest'
      ? sortParam
      : 'newest';

  const priceMinParam = Number(params.get('priceMin'));
  const priceMaxParam = Number(params.get('priceMax'));

  return {
    query: params.get('q') ?? '',
    collections: parseCsv(params.get('collections')),
    materials: parseCsv(params.get('materials')),
    priceMin: Number.isFinite(priceMinParam) && priceMinParam >= 0 ? priceMinParam : 0,
    priceMax:
      Number.isFinite(priceMaxParam) && priceMaxParam >= 0
        ? priceMaxParam
        : maxPrice,
    sort,
  };
}

function serializeFiltersToParams(filters: ProductFilters, maxPrice: number) {
  const params = new URLSearchParams();

  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.collections.length > 0) params.set('collections', filters.collections.join(','));
  if (filters.materials.length > 0) params.set('materials', filters.materials.join(','));
  if (filters.priceMin > 0) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax < maxPrice) params.set('priceMax', String(filters.priceMax));
  if (filters.sort !== 'newest') params.set('sort', filters.sort);

  return params;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const maxPrice = useMemo(() => getMaxPrice(products), [products]);
  const [loading] = useState(false);
  const searchKey = searchParams.toString();

  const filters = useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(searchKey), maxPrice),
    [searchKey, maxPrice],
  );

  const updateFilters = useCallback((nextFilters: ProductFilters) => {
    const nextParams = serializeFiltersToParams(
      {
        ...nextFilters,
        priceMax: Math.max(nextFilters.priceMax, maxPrice),
      },
      maxPrice,
    );
    const nextSearch = nextParams.toString();

    if (nextSearch !== searchKey) {
      const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
      router.push(nextUrl, { scroll: false });
    }
  }, [pathname, router, searchKey, maxPrice]);

  const filtered = useMemo(() => {
    return applyFilters(products, {
      ...filters,
      priceMax: Math.max(filters.priceMax, maxPrice),
    });
  }, [products, filters, maxPrice]);

  const hasNoResults = !loading && products.length > 0 && filtered.length === 0;

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

      <FilterBar products={products} value={filters} onChange={updateFilters} />

      <div className="mt-8">
        {hasNoResults ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <p className="font-serif text-lg text-zinc-900">Khong tim thay san pham phu hop.</p>
            <p className="mt-2 text-sm text-zinc-600">
              Thu thay doi bo loc hoac tim kiem bang tu khoa ngan hon.
            </p>
          </div>
        ) : (
          <ProductGrid products={filtered} loading={loading} skeletonCount={8} />
        )}
      </div>
    </section>
  );
}
