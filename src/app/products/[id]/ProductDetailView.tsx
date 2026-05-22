'use client';

import { Breadcrumb, Card, Col, Rate, Row, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import ProductPurchasePanel from '@/components/products/ProductPurchasePanel';
import { formatUSD } from '@/lib/utils';
import styles from './product-detail.module.scss';

const { Title, Text, Paragraph } = Typography;

interface ProductDetailViewProps {
  product: {
    id: number | string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  };
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
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
                src={product.image}
                alt={product.title}
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
                {product.title}
              </Title>
              <Text className={styles.price}>
                {formatUSD(product.price)}
              </Text>

              <div className={styles.rating}>
                <Space align="center" size={10}>
                  <Rate allowHalf disabled value={product.rating?.rate ?? 0} />
                  <Text type="secondary">
                    {(product.rating?.rate ?? 0).toFixed(1)} ({product.rating?.count ?? 0} đánh giá)
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
                title={product.title}
                price={product.price}
                image={product.image}
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
