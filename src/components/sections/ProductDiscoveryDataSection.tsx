'use client';

import useSWR from 'swr';
import ProductDiscoverySection from '@/components/sections/ProductDiscoverySection';
import { fetchProducts } from '@/lib/products-client';

export default function ProductDiscoveryDataSection() {
  const { data: products, error, isLoading, mutate } = useSWR(
    'products:list',
    () => fetchProducts(),
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h2 className="font-serif text-2xl tracking-tight text-zinc-950">Tuyen chon cua Dang Y</h2>
          <p className="mt-2 text-sm text-zinc-600">Dang tai danh sach san pham...</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center">
          <div className="mx-auto h-5 w-40 animate-pulse rounded bg-zinc-100" />
          <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => {
              void mutate();
            }}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#722F37] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
          >
            Thu lai
          </button>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <p className="font-serif text-lg text-zinc-900">Hien chua co san pham de hien thi.</p>
          <p className="mt-2 text-sm text-zinc-600">Vui long quay lai sau hoac cap nhat du lieu.</p>
        </div>
      </section>
    );
  }

  return <ProductDiscoverySection products={products} />;
}
