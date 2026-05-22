import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByIdOrSlug } from '@/lib/products';
import ProductDetailView from './ProductDetailView';
import styles from './product-detail.module.scss';

type ApiRating = {
  rate: number;
  count: number;
};

type ApiProduct = {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ApiRating;
};

function getSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return 'http://localhost:3000';
}

async function getProduct(id: string): Promise<ApiProduct | null> {
  // Try internal product first (supports slug or internal id)
  const local = getProductByIdOrSlug(id);
  if (local) {
    return {
      id: local.id,
      title: local.name,
      price: local.price,
      description: local.description,
      category: local.category,
      image: Array.isArray(local.images) && local.images.length > 0 ? local.images[0] : '/images/categories/default_real.jpg',
      rating: { rate: 4.5, count: 0 },
    };
  }

  // Fallback to external numeric API when id is a number
  if (!/^\d+$/.test(id)) return null;

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = (await response.json()) as ApiProduct;
    if (!data || !data.id) return null;

    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  const siteOrigin = getSiteOrigin();
  const productUrl = `${siteOrigin}/products/${id}`;

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
      description: 'Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị gỡ khỏi hệ thống.',
      robots: { index: false, follow: false },
      alternates: {
        canonical: productUrl,
      },
    };
  }

  const title = `${product.title} | Dáng Ý Store`;
  const description = product.description;
  const imageUrl = product.image;

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website',
      url: productUrl,
      siteName: 'Dáng Ý Store',
      title,
      description,
      images: [{ url: imageUrl, alt: product.title }],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <ProductDetailView product={product} />
  );
}
