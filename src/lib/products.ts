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

export async function fetchProduct(id: string): Promise<Product | null> {
  const local = getProductByIdOrSlug(id);
  if (local) return local;

  // For external products, we'll try to fetch from an API if the ID is numeric
  if (!/^\d+$/.test(id)) return null;

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.id) return null;

    // Normalize API product to our Product type
    return {
      id: String(data.id),
      name: data.title,
      slug: String(data.id),
      price: data.price,
      images: [data.image],
      category: data.category,
      collection: 'External API',
      materials: [],
      createdAt: new Date().toISOString(),
      description: data.description,
      hasVariants: false,
      variants: [],
    };
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return mockProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}
