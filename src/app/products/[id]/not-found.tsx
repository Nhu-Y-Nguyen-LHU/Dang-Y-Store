'use client';

import Link from 'next/link';
import { Alert, Button, Space, Typography } from 'antd';
import styles from './product-detail.module.scss';

export default function ProductNotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.notFoundWrap}>
        <Space orientation="vertical" size={16}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Không tìm thấy sản phẩm
          </Typography.Title>
          <Alert
            type="warning"
            showIcon
            message="ID sản phẩm không hợp lệ hoặc không tồn tại trên API"
            description="Vui lòng quay lại trang danh sách và chọn một sản phẩm khác."
          />
          <Space>
            <Link href="/products">
              <Button type="primary">Quay lại danh sách sản phẩm</Button>
            </Link>
            <Link href="/">
              <Button>Về trang chủ</Button>
            </Link>
          </Space>
        </Space>
      </div>
    </section>
  );
}
