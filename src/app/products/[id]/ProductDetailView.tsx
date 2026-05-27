'use client';

import { Breadcrumb, Card, Col, Rate, Row, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import ProductPurchasePanel from '@/components/products/ProductPurchasePanel';
import { formatVND } from '@/lib/utils';
import { Product } from '@/types/product';
import styles from './product-detail.module.scss';

const { Title, Text, Paragraph } = Typography;

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const mainImage = product.images[0] || '';

  return (
    <div className={styles.page}>
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { title: <Link href="/">Trang chủ</Link> },
          { title: <Link href="/products">Danh sách sản phẩm</Link> },
          { title: `#${product.id}` },
        ]}
      />

      <Card className={styles.card}>
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} md={12}>
            <div className={styles.imageWrap}>
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Space orientation="vertical" size={6} style={{ width: '100%' }}>
              <Tag>{product.category}</Tag>
              <Title level={2} className={styles.title}>
                {product.name}
              </Title>
              <Text className={styles.price}>
                {formatVND(product.price)}
              </Text>

              {/* Mock rating since Product type doesn't have it yet */}
              <div className={styles.rating}>
                <Space align="center" size={10}>
                  <Rate allowHalf disabled value={4.5} />
                  <Text type="secondary">
                    4.5 (24 đánh giá)
                  </Text>
                </Space>
              </div>

              <Text className={styles.label}>Mô tả chi tiết</Text>
              <Paragraph className={styles.description}>
                {product.description}
              </Paragraph>

              <Text className={styles.label}>Số lượng</Text>
              <ProductPurchasePanel
                id={String(product.id)}
                title={product.name}
                price={product.price}
                image={mainImage}
                category={product.category}
                description={product.description}
              />
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
