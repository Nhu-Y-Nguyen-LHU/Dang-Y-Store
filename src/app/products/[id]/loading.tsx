'use client';

import { Card, Col, Row, Skeleton, Space } from 'antd';
import styles from './product-detail.module.scss';

export default function ProductDetailLoading() {
  return (
    <section className={styles.page}>
      <Card className={styles.card}>
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} md={12}>
            <div style={{ height: 420 }}>
              <Skeleton active title={false} paragraph={{ rows: 12 }} />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Space orientation="vertical" size={14} style={{ width: '100%' }}>
              <Skeleton.Input active size="small" style={{ width: 120 }} />
              <Skeleton.Input active size="large" style={{ width: '100%', height: 36 }} />
              <Skeleton.Input active size="large" style={{ width: 180 }} />
              <Skeleton active paragraph={{ rows: 6 }} />
              <Skeleton.Button active size="large" style={{ width: 220 }} />
            </Space>
          </Col>
        </Row>
      </Card>
    </section>
  );
}
