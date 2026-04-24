import { mockProducts } from '@/data/products';
import type { Product } from '@/types/product';

export function getAllProducts(): Product[] {
  return mockProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return mockProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}
