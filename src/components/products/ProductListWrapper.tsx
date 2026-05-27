'use client';

import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProductCard from './ProductCard';
import { Empty } from 'antd';
import type { Product } from '@/types/product';
import type { ProductFilters, SortOption } from './FilterBar';

// 1. Tối ưu hoá Bundle Size: Dynamic Import FilterBar (Ant Design Heavy Component)
// ssr: false đảm bảo component phức tạp này chỉ được tải và thực thi ở Client-side.
const DynamicFilterBar = dynamic(() => import('./FilterBar'), {
  ssr: false,
  loading: () => (
    <div className="h-16 bg-gray-50 border border-gray-100 rounded-xl animate-pulse mb-6 flex items-center px-4">
      <div className="h-5 w-32 bg-gray-200 rounded" />
    </div>
  ),
});

interface ProductListWrapperProps {
  initialProducts: Product[];
}

/**
 * Component Wrapper quản lý sản phẩm tích hợp Next.js URL Search Parameters (Query Strings).
 * GIẢI QUYẾT TRIỆT ĐỂ VẤN ĐỀ "TỰ ĐỘNG TẢI LẠI VÀ ĐỒNG BỘ BỘ LỌC":
 * 1. Không dùng useState cục bộ nữa, chuyển trạng thái bộ lọc lên thanh URL trình duyệt.
 * 2. Khi người dùng lọc, thay đổi khoảng giá hoặc click "Đặt lại" (Reset) -> URL cập nhật ngay lập tức.
 * 3. Trình duyệt có thể lưu vết lịch sử (Back/Forward), chia sẻ đường dẫn đã lọc cho người khác,
 *    và hỗ trợ tải lại trang (F5) mà không bao giờ bị mất bộ lọc hiện tại!
 */
export default function ProductListWrapper({ initialProducts }: ProductListWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Xác định khoảng giá cao nhất động để gán giá trị mặc định cho Slider
  const maxPriceLimit = useMemo(() => {
    return initialProducts.reduce((max, p) => Math.max(max, p.price), 0) || 5000000;
  }, [initialProducts]);

  // Đọc các giá trị bộ lọc ĐỘNG từ URL Search Params (Thay thế cho useState cục bộ)
  const filters: ProductFilters = useMemo(() => {
    return {
      query: searchParams.get('query') || '',
      categories: searchParams.getAll('category'),
      collections: searchParams.getAll('collection'),
      materials: searchParams.getAll('material'),
      priceMin: parseInt(searchParams.get('minPrice') || '0', 10),
      priceMax: parseInt(searchParams.get('maxPrice') || String(maxPriceLimit), 10),
      sort: (searchParams.get('sort') || 'newest') as SortOption,
    };
  }, [searchParams, maxPriceLimit]);

  /**
   * Đồng bộ hóa bộ lọc lên thanh địa chỉ URL của Next.js Router
   */
  const handleFilterChange = (nextFilters: ProductFilters) => {
    const params = new URLSearchParams();

    // 1. Đồng bộ từ khóa tìm kiếm
    if (nextFilters.query.trim()) {
      params.set('query', nextFilters.query);
    }

    // 2. Đồng bộ các mảng bộ lọc (categories, collections, materials)
    nextFilters.categories.forEach((cat) => params.append('category', cat));
    nextFilters.collections.forEach((col) => params.append('collection', col));
    nextFilters.materials.forEach((mat) => params.append('material', mat));

    // 3. Đồng bộ khoảng giá tiền
    if (nextFilters.priceMin > 0) {
      params.set('minPrice', String(nextFilters.priceMin));
    }
    if (nextFilters.priceMax < maxPriceLimit) {
      params.set('maxPrice', String(nextFilters.priceMax));
    }

    // 4. Đồng bộ tiêu chí sắp xếp
    if (nextFilters.sort !== 'newest') {
      params.set('sort', nextFilters.sort);
    }

    // Xây dựng URL mới chứa đầy đủ các tham số bộ lọc đã mã hoá
    const newUrl = `${pathname}?${params.toString()}`;

    // ÉP BUỘC TẢI LẠI TRANG CỨNG (Hard Reload):
    // Thay vì cập nhật ngầm (Soft push), chúng ta ghi đè địa chỉ window.location
    // để buộc trình duyệt phải tải lại toàn bộ trang vật lý, đồng bộ và hiển thị lại từ đầu.
    window.location.href = newUrl;
  };

  // Thực hiện lọc và sắp xếp sản phẩm chuẩn xác tại Client-side dựa trên dữ liệu URL thực tế
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Lọc theo từ khóa tìm kiếm (Query)
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Lọc theo danh mục (Categories)
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Lọc theo bộ sưu tập (Collections)
    if (filters.collections.length > 0) {
      result = result.filter((p) => filters.collections.includes(p.collection));
    }

    // Lọc theo chất liệu (Materials)
    if (filters.materials.length > 0) {
      result = result.filter((p) =>
        p.materials?.some((m) => filters.materials.includes(m))
      );
    }

    // Lọc theo khoảng giá
    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Sắp xếp sản phẩm (Sorting)
    if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [initialProducts, filters]);

  return (
    <div className="space-y-6">
      {/* Bộ điều khiển lọc dynamic đồng bộ thời gian thực lên thanh URL */}
      <DynamicFilterBar
        products={initialProducts}
        value={filters}
        onChange={handleFilterChange}
        hasPriceFilter={filters.priceMin > 0 || filters.priceMax < maxPriceLimit}
      />

      {/* Kết quả danh sách sản phẩm */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
          <Empty description="Không có sản phẩm nào khớp với tiêu chí tìm kiếm." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              // TỐI ƯU LCP: Tải trước cho 2 sản phẩm màn hình đầu tiên
              priority={index < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
