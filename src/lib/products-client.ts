import type { Product } from '@/types/product';

type ProductListResponse = {
  data?: Product[];
  error?: string;
};

type ProductDetailResponse = {
  data?: Product;
  error?: string;
};

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch('/api/products', { signal, cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Khong the tai danh sach san pham.');
  }

  const payload = (await response.json()) as ProductListResponse;
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchProductBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<Product | null> {
  const response = await fetch(`/api/products/${slug}`, { signal, cache: 'no-store' });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Khong the tai thong tin san pham.');
  }

  const payload = (await response.json()) as ProductDetailResponse;
  return payload.data ?? null;
}
