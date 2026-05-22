import { mockProducts } from '@/data/products';
import type { Product } from '@/types/product';

const productIndex = new Map<string, Product>();

for (const product of mockProducts) {
  productIndex.set(product.id, product);
  productIndex.set(product.slug, product);
}

export function getAllProducts(): Product[] {
  return mockProducts;
}

/**
 * Alias for getAllProducts to match naming convention in refactoring
 */
export function getProducts(): Product[] {
  return getAllProducts();
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.slug === slug);
}

export function getProductByIdOrSlug(idOrSlug: string): Product | undefined {
  return productIndex.get(idOrSlug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return mockProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}
