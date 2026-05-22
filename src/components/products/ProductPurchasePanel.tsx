'use client';

import { useMemo, useState } from 'react';
import { Button, InputNumber, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types/product';

type ProductPurchasePanelProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

function toCartProduct(props: ProductPurchasePanelProps): Product {
  return {
    id: props.id,
    name: props.title,
    slug: props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    price: props.price,
    images: [props.image],
    category: props.category,
    collection: 'Public API',
    materials: [],
    createdAt: new Date().toISOString(),
    description: props.description,
    hasVariants: false,
    variants: [],
  };
}

export default function ProductPurchasePanel(props: ProductPurchasePanelProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const cartProduct = useMemo(() => toCartProduct(props), [props]);

  const handleAddToCart = () => {
    addItem(cartProduct, quantity);
  };

  const handleBuyNow = () => {
    addItem(cartProduct, quantity);
    router.push('/checkout');
  };

  return (
    <Space orientation="vertical" size={14} style={{ width: '100%' }}>
      <InputNumber
        min={1}
        max={20}
        value={quantity}
        onChange={(value) => setQuantity(Number(value) || 1)}
        size="large"
        style={{ width: 140 }}
      />

      <Space wrap>
        <Button type="primary" size="large" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </Button>
        <Button size="large" onClick={handleBuyNow}>
          Mua ngay
        </Button>
      </Space>
    </Space>
  );
}
