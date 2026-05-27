import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase, isDummySupabase } from '@/lib/supabase';
import { mockProducts } from '@/data/products';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import type { Product } from '@/types/product';

// Ép buộc Next.js không cache tĩnh trang chi tiết để luôn lấy dữ liệu giá/tồn kho thực tế
export const revalidate = 0;

/**
 * Trợ năng truy vấn sản phẩm thông minh dựa trên Slug thân thiện (SEO-friendly) hoặc ID.
 * Bỏ qua kết nối DB nếu đang dùng key giả lập để tối ưu tốc độ tối đa (0ms).
 */
async function getProductBySlugOrId(slugOrId: string): Promise<Product | null> {
  // TỐI ƯU HÓA TỐC ĐỘ: Nếu đang dùng key giả lập, bypass kết nối DB để tránh chờ mạng timeout (23 giây)!
  if (isDummySupabase) {
    const local = mockProducts.find(
      (p) => p.slug === slugOrId || p.id === slugOrId
    );
    return (local as Product) || null;
  }

  try {
    // Bước 1: Ưu tiên tìm kiếm theo slug thân thiện (Ví dụ: ao-dai-gam-hoa)
    const { data: productBySlug } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slugOrId)
      .maybeSingle();

    if (productBySlug) return productBySlug as Product;

    // Bước 2: Tìm kiếm theo UUID hoặc ID thông thường nếu khách hàng click từ link cũ
    const { data: productById } = await supabase
      .from('products')
      .select('*')
      .eq('id', slugOrId)
      .maybeSingle();

    if (productById) return productById as Product;

    // Bước 3: Dự phòng (Fallback) kiểm tra dữ liệu Mock cũ để tránh bị lỗi trang (Graceful Fallback)
    const local = mockProducts.find(
      (p) => p.slug === slugOrId || p.id === slugOrId
    );
    if (local) return local as Product;
  } catch (err) {
    console.error('[Supabase Detail Fetch Error]:', err);
  }

  return null;
}

/**
 * Sinh Siêu dữ liệu SEO động (Dynamic SEO Metadata) chuẩn quốc tế.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlugOrId(id);

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Dáng Ý Store',
      description: 'Sản phẩm quý khách tìm kiếm không tồn tại hoặc đã dừng bán.',
      robots: { index: false, follow: false },
    };
  }

  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productUrl = `${siteOrigin}/products/${product.slug || product.id}`;
  const title = `${product.name} | Dáng Ý Store — Thời Trang Gấm Quý Phái`;
  const description = product.description;
  const imageUrl = product.images?.[0] || '';

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'article',
      url: productUrl,
      siteName: 'Dáng Ý Store',
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/**
 * Server Component: Trang Chi Tiết Sản Phẩm (Dáng Ý Premium Detail Page)
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlugOrId(id);

  // Trả về trang 404 chuẩn của Next.js nếu sản phẩm hoàn toàn không tồn tại
  if (!product) {
    notFound();
  }

  // Tải sản phẩm liên quan: Tránh chờ timeout 23s nếu dùng key giả lập
  let relatedProducts: Product[] = [];
  if (isDummySupabase) {
    relatedProducts = mockProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4) as Product[];
  } else {
    try {
      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);

      if (relatedData) {
        relatedProducts = relatedData as Product[];
      }
    } catch (err) {
      console.error('Lỗi khi truy vấn sản phẩm liên quan từ DB:', err);
    }
  }

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
