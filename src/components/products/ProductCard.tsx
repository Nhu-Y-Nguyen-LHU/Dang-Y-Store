'use client';

import { Button, Card, Rate, Typography } from 'antd';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './ProductCard.module.scss';
import { useCartStore } from '@/store/useCartStore';

export type PublicApiProduct = {
  id: number | string;
  title: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
  currency?: 'USD' | 'VND';
};

interface ProductCardProps {
  product: Product | PublicApiProduct;
  currency?: 'USD' | 'VND';
  priority?: boolean; // Thuộc tính tối ưu ảnh LCP (True cho các sản phẩm màn hình đầu)
}

function isInternalProduct(product: Product | PublicApiProduct): product is Product {
  return 'name' in product;
}

function formatPrice(price: number, currency: 'USD' | 'VND') {
  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(price);
}

function toCartProduct(normalized: {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  href: string;
}): Product {
  const slug = normalized.href.startsWith('/product/')
    ? normalized.href.replace('/products/', '')
    : normalized.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    id: normalized.id,
    name: normalized.title,
    slug,
    price: normalized.price,
    images: [normalized.image],
    category: normalized.category,
    collection: 'API Products',
    materials: [],
    createdAt: new Date().toISOString(),
    description: normalized.title,
    hasVariants: false,
    variants: [],
  };
}

const ProductCard = ({ product, currency, priority = false }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);

  const normalized = useMemo(() => {
    if (isInternalProduct(product)) {
      return {
        id: product.id,
        title: product.name,
        image:
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : `/images/categories/${(product.category || 'default').toLowerCase().replace(/\s+/g, '-')}.jpg`,
        price: product.price,
        rating: 4.8,
        currency: (currency ?? 'VND') as 'USD' | 'VND',
        category: product.category || 'Sản phẩm',
        href: `/products/${product.slug || product.id}`,
      };
    }

    return {
      id: String(product.id),
      title: product.title,
      image: product.image,
      price: product.price,
      rating: product.rating ?? 4,
      currency: (currency ?? product.currency ?? 'USD') as 'USD' | 'VND',
      category: product.category || 'Sản phẩm',
      href: `/products/${product.id}`,
    };
  }, [currency, product]);

  const displayPrice = formatPrice(normalized.price, normalized.currency);

  const handleAddToCart = () => {
    addItem(toCartProduct(normalized), 1);
  };

  return (
    <Card
      hoverable
      className={styles.productCard}
      cover={
        <div className={styles.imageWrap}>
          <Link href={normalized.href} className={styles.imageLink} aria-label={normalized.title}>
            <Image
              src={normalized.image}
              alt={normalized.title}
              fill
              priority={priority} // Kích hoạt nạp trước cho ảnh màn hình đầu
              className={styles.productImage}
              // Cấu hình sizes chuẩn Responsive Web Design giúp trình duyệt chọn kích thước ảnh nhỏ nhất phù hợp
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={(e) => {
                e.currentTarget.src = '/images/categories/default_real.jpg';
              }}
            />
          </Link>
        </div>
      }
    >
      <div className={styles.body}>
        <Typography.Title level={5} className={styles.title}>
          {normalized.title}
        </Typography.Title>

        <Typography.Text className={styles.price}>{displayPrice}</Typography.Text>

        <div className={styles.ratingRow}>
          <Rate allowHalf disabled value={normalized.rating} className={styles.rate} />
          <Typography.Text className={styles.ratingText}>
            {normalized.rating.toFixed(1)}
          </Typography.Text>
        </div>

        <div className={styles.ctaWrap}>
          <Button type="primary" block size="large" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
