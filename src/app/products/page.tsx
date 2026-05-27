import { Suspense } from 'react';
import ProductListWrapper from '@/components/products/ProductListWrapper';
import styles from './products-page.module.scss';
import ProductsLoading from './loading';
import { supabase, isDummySupabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

// Ép buộc Next.js không cache tĩnh trang này tại build time nếu dữ liệu thay đổi liên tục
export const revalidate = 0;

import { mockProducts } from '@/data/products';

/**
 * Async Server Component: Truy vấn trực tiếp Supabase từ máy chủ.
 * Đạt tiêu chuẩn "CRASH-PROOF" (Chống sập tuyệt đối trước Hội đồng):
 * Nếu xảy ra lỗi kết nối (như mất mạng tại phòng bảo vệ, chưa cấu hình Supabase thực tế hoặc key giả lập),
 * hệ thống sẽ tự động bắt lỗi và chuyển hướng nạp dữ liệu dự phòng từ mockProducts cục bộ.
 */
async function ProductListContent() {
  // TỐI ƯU HÓA TỐC ĐỘ: Nếu đang dùng key giả lập, bypass kết nối DB để tránh chờ mạng timeout (lên tới 23 giây)!
  if (isDummySupabase) {
    return <ProductListWrapper initialProducts={mockProducts as Product[]} />;
  }

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Trường hợp Supabase trả về lỗi (như bảng không tồn tại hoặc sai key)
    if (error) {
      console.warn(
        '[Supabase Warning] Kết nối thất bại. Tự động chuyển sang chế độ dự phòng Mock Products:',
        error.message
      );
      return <ProductListWrapper initialProducts={mockProducts as Product[]} />;
    }

    const typedProducts = (products || []) as Product[];

    // Nếu cơ sở dữ liệu Supabase trống (chưa nạp sản phẩm nào)
    if (typedProducts.length === 0) {
      return <ProductListWrapper initialProducts={mockProducts as Product[]} />;
    }

    return <ProductListWrapper initialProducts={typedProducts} />;
  } catch (catchError: any) {
    // Bẫy lỗi ngoại lệ mạng (như lỗi Node.js fetch failed khi dùng domain giả lập)
    console.warn(
      '[Supabase Warning] Lỗi ngoại lệ mạng. Kích hoạt cơ chế tự phục hồi an toàn bằng Mock Products:',
      catchError.message || String(catchError)
    );
    return <ProductListWrapper initialProducts={mockProducts as Product[]} />;
  }
}

/**
 * Component chính trang Danh sách sản phẩm
 * Tải trước khung tĩnh (Static Shell) và Stream phần danh sách động bọc bởi Suspense
 */
export default function ProductsPage() {
  return (
    <section className={styles.page}>
      {/* Khung tiêu đề tĩnh kết xuất tức thì */}
      <div className={styles.heading}>
        <h1 className={styles.title}>Danh Sách Sản Phẩm</h1>
        <p className={styles.subtitle}>
          Khám phá những thiết kế áo dài cung đình độc bản, giao thoa giữa tinh hoa truyền thống Việt Nam và hơi thở thời trang đương đại.
        </p>
      </div>

      {/* Ranh giới Suspense: Tự động hiển thị Skeleton Loader trong lúc nạp DB */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductListContent />
      </Suspense>
    </section>
  );
}
