import { mockProducts } from '@/data/products';
import type { Product } from '@/types/product';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import type { Metadata } from 'next';

// This is a simplified version. A real app would fetch data based on slug.
const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find((p) => p.slug === slug);
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
      robots: { index: false, follow: false },
    };
  }

  const title = product.name;
  const description = product.description;
  const image = product.images?.[0];

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images: image
        ? [
            {
              url: image,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
