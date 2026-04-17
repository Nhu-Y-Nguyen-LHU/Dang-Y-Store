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
}
