'use client';

import { useMemo, useState } from 'react';
import { Input, Select, Button, Drawer, Checkbox, Slider, Row, Col, Typography, Space, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatCurrencyVND } from '@/store/useCartStore';

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

import type { Product } from '@/types/product';

export default function FilterBar({ products, value, onChange, hasPriceFilter = false }: FilterBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
    return products.reduce((max, p) => Math.max(max, p.price), 0);
  }, [products]);

  const update = (patch: Partial<ProductFilters>) => {
    onChange({ ...value, ...patch });
  };

  const activeFilterCount =
    value.categories.length + value.collections.length + value.materials.length + (hasPriceFilter ? 1 : 0);

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12} lg={14}>
          <Input
            size="large"
            placeholder="Tìm kiếm theo tên, bộ sưu tập…"
            prefix={<SearchOutlined />}
            value={value.query}
            onChange={(e) => update({ query: e.target.value })}
            allowClear
          />
        </Col>
        <Col xs={14} md={8} lg={6}>
          <Select
            size="large"
            style={{ width: '100%' }}
            value={value.sort}
            onChange={(val) => update({ sort: val as SortOption })}
            options={[
              { label: 'Mới nhất', value: 'newest' },
              { label: 'Giá tăng dần', value: 'price-asc' },
              { label: 'Giá giảm dần', value: 'price-desc' },
            ]}
          />
        </Col>
        <Col xs={10} md={4} lg={4}>
          <Badge count={activeFilterCount} size="small" offset={[-5, 5]}>
            <Button
              size="large"
              block
              icon={<FilterOutlined />}
              onClick={() => setIsFiltersOpen(true)}
            >
              Bộ lọc
            </Button>
          </Badge>
        </Col>
      </Row>

      <Drawer
        title="Bộ lọc sản phẩm"
        placement="right"
        size="large"
        onClose={() => setIsFiltersOpen(false)}
        open={isFiltersOpen}
        footer={
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              block
              icon={<ReloadOutlined />}
              onClick={() =>
                onChange({
                  query: '',
                  categories: [],
                  collections: [],
                  materials: [],
                  priceMin: 0,
                  priceMax: maxPrice,
                  sort: 'newest',
                })
              }
            >
              Đặt lại
            </Button>
            <Button type="primary" block onClick={() => setIsFiltersOpen(false)}>
              Xem kết quả
            </Button>
          </div>
        }
      >
        <Space orientation="vertical" size={32} style={{ width: '100%' }}>
          <div>
            <Title level={5}>Danh mục</Title>
            <Checkbox.Group
              options={categories}
              value={value.categories}
              onChange={(vals) => update({ categories: vals as string[] })}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            />
          </div>

          <div>
            <Title level={5}>Bộ sưu tập</Title>
            <Checkbox.Group
              options={collections}
              value={value.collections}
              onChange={(vals) => update({ collections: vals as string[] })}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            />
          </div>

          <div>
            <Title level={5}>Chất liệu</Title>
            <Checkbox.Group
              options={filterMaterials}
              value={value.materials}
                onChange={(vals) => update({ materials: vals as string[] })}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            />
          </div>

          <div>
            <Title level={5}>Khoảng giá</Title>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{formatCurrencyVND(value.priceMin)}</Text>
              <Text type="secondary"> — </Text>
              <Text strong>{formatCurrencyVND(value.priceMax)}</Text>
            </div>
            <Slider
              range
              min={0}
              max={maxPrice}
              step={10000}
              value={[value.priceMin, value.priceMax]}
              onChange={([min, max]) => update({ priceMin: min, priceMax: max })}
              tooltip={{ formatter: (val) => formatCurrencyVND(val || 0) }}
            />
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
