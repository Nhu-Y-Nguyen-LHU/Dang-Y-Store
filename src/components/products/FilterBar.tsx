'use client';

import { useMemo, useState } from 'react';
import { Input, Select, Button, Drawer, Checkbox, Slider, Row, Col, Typography, Space, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatCurrencyVND } from '@/store/useCartStore';
import type { Product } from '@/types/product';

const { Title, Text } = Typography;

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export type ProductFilters = {
  query: string;
  categories: string[];
  collections: string[];
  materials: string[];
  priceMin: number;
  priceMax: number;
  sort: SortOption;
};

type FilterBarProps = {
  products: Product[];
  value: ProductFilters;
  onChange: (next: ProductFilters) => void;
  hasPriceFilter?: boolean;
};

/**
 * Component FilterBar: Thanh lọc và tìm kiếm sản phẩm.
 * TỐI ƯU HÓA TRẢI NGHIỆM ĐỒNG BỘ:
 * 1. Các bộ lọc bên ngoài (Tìm kiếm, Sắp xếp) sẽ kích hoạt đồng bộ ngay lập tức.
 * 2. Các bộ lọc phức tạp bên trong Drawer (Danh mục, Chất liệu, Giá cả) sẽ ĐỢI khách hàng chọn xong,
 *    chỉ khi bấm "Xem kết quả" hoặc "Đặt lại" thì mới thực hiện tải lại trang vật lý.
 * 3. Tránh hiện tượng reload trang liên tục khi đang click chọn từng checkbox.
 */
export default function FilterBar({ products, value, onChange, hasPriceFilter = false }: FilterBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // State tạm thời lưu trữ bộ lọc bên trong Drawer
  const [localFilters, setLocalFilters] = useState<ProductFilters>(value);

  // Group độc nhất các thuộc tính phục vụ bộ lọc từ danh sách sản phẩm thật
  const collections = useMemo(() => {
    const set = new Set(products.map((p) => p.collection).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [products]);

  const filterMaterials = useMemo(() => {
    const set = new Set(products.flatMap((p) => p.materials ?? []));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [products]);

  const maxPrice = useMemo(() => {
    return products.reduce((max, p) => Math.max(max, p.price), 0) || 5000000;
  }, [products]);

  // Cập nhật bộ lọc tạm thời bên trong Drawer (Không kích hoạt onChange của cha)
  const updateLocal = (patch: Partial<ProductFilters>) => {
    setLocalFilters((prev) => ({ ...prev, ...patch }));
  };

  // Mở Drawer và đồng bộ bộ lọc hiện tại của cha vào state tạm thời
  const handleOpenDrawer = () => {
    setLocalFilters(value);
    setIsFiltersOpen(true);
  };

  // Đếm số bộ lọc đang kích hoạt để hiển thị Badge
  const activeFilterCount =
    value.categories.length + value.collections.length + value.materials.length + (hasPriceFilter ? 1 : 0);

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]} align="middle">
        {/* Tìm kiếm theo tên sản phẩm (Kích hoạt ngay khi nhập xong hoặc ấn Enter) */}
        <Col xs={24} md={12} lg={14}>
          <Input
            size="large"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            prefix={<SearchOutlined />}
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            onPressEnter={() => onChange(value)}
            allowClear
          />
        </Col>

        {/* Bộ sắp xếp giá tiền (Kích hoạt ngay lập tức) */}
        <Col xs={14} md={8} lg={6}>
          <Select
            size="large"
            style={{ width: '100%' }}
            value={value.sort}
            onChange={(val) => onChange({ ...value, sort: val as SortOption })}
            options={[
              { label: 'Mới nhất', value: 'newest' },
              { label: 'Giá tăng dần', value: 'price-asc' },
              { label: 'Giá giảm dần', value: 'price-desc' },
            ]}
          />
        </Col>

        {/* Nút mở bộ lọc nâng cao */}
        <Col xs={10} md={4} lg={4}>
          <Badge count={activeFilterCount} size="small" offset={[-5, 5]}>
            <Button
              size="large"
              block
              icon={<FilterOutlined />}
              onClick={handleOpenDrawer}
            >
              Bộ lọc
            </Button>
          </Badge>
        </Col>
      </Row>

      {/* Drawer chứa bộ lọc nâng cao */}
      <Drawer
        title="Bộ lọc nâng cao"
        placement="right"
        size="large"
        onClose={() => setIsFiltersOpen(false)}
        open={isFiltersOpen}
        footer={
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Nút Đặt lại: Xóa sạch bộ lọc và Tải lại trang vật lý */}
            <Button
              block
              icon={<ReloadOutlined />}
              onClick={() => {
                const resetFilters: ProductFilters = {
                  query: '',
                  categories: [],
                  collections: [],
                  materials: [],
                  priceMin: 0,
                  priceMax: maxPrice,
                  sort: 'newest',
                };
                onChange(resetFilters);
                setIsFiltersOpen(false);
              }}
            >
              Đặt lại
            </Button>

            {/* Nút Xem kết quả: Xác nhận áp dụng bộ lọc và Tải lại trang vật lý */}
            <Button
              type="primary"
              block
              onClick={() => {
                onChange(localFilters);
                setIsFiltersOpen(false);
              }}
            >
              Xem kết quả
            </Button>
          </div>
        }
      >
        <Space direction="vertical" size={32} style={{ width: '100%' }}>
          {/* Lọc theo danh mục */}
          {categories.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 12 }}>Danh mục sản phẩm</Title>
              <Checkbox.Group
                options={categories}
                value={localFilters.categories}
                onChange={(vals) => updateLocal({ categories: vals as string[] })}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              />
            </div>
          )}

          {/* Lọc theo bộ sưu tập */}
          {collections.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 12 }}>Bộ sưu tập</Title>
              <Checkbox.Group
                options={collections}
                value={localFilters.collections}
                onChange={(vals) => updateLocal({ collections: vals as string[] })}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              />
            </div>
          )}

          {/* Lọc theo chất liệu */}
          {filterMaterials.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 12 }}>Chất liệu thiết kế</Title>
              <Checkbox.Group
                options={filterMaterials}
                value={localFilters.materials}
                onChange={(vals) => updateLocal({ materials: vals as string[] })}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              />
            </div>
          )}

          {/* Lọc theo khoảng giá tiền */}
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>Khoảng giá (VND)</Title>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{formatCurrencyVND(localFilters.priceMin)}</Text>
              <Text type="secondary"> — </Text>
              <Text strong>{formatCurrencyVND(localFilters.priceMax)}</Text>
            </div>
            <Slider
              range
              min={0}
              max={maxPrice}
              step={50000}
              value={[localFilters.priceMin, localFilters.priceMax]}
              onChange={([min, max]) => updateLocal({ priceMin: min, priceMax: max })}
              tooltip={{ formatter: (val) => formatCurrencyVND(val || 0) }}
            />
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
