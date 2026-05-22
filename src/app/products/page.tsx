import { Col, Empty, Row } from 'antd';
import ProductCard from '@/components/products/ProductCard';
import styles from './products-page.module.scss';
import { getAllProducts } from '@/lib/products';

function ProductListContent() {
  const products = getAllProducts();

  // Hiển thị toàn bộ sản phẩm nếu không có bộ lọc
  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <Empty description="Danh sách sản phẩm hiện đang trống" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]} className={styles.gridRow}>
      {products.map((product) => (
        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}

export default function ProductsPage() {
  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Danh Sách Sản Phẩm</h1>
        <p className={styles.subtitle}>
          Dữ liệu được lấy trực tiếp từ hệ thống nội bộ (Server-side rendering).
        </p>
      </div>

      <ProductListContent />
    </section>
  );
}
