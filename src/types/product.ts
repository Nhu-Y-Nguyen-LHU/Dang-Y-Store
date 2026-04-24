export interface ProductVariant {
  id: string;
  sku: string;
  name?: string; // e.g., "Gold - Size M"
  color?: string;
  size?: string;
  material?: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  collection: string;
  materials: string[];
  createdAt: string; // ISO date string
  description: string;
  isNew?: boolean;
  variants?: ProductVariant[];
  hasVariants?: boolean;
}
