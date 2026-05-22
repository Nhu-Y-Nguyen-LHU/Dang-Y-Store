import { Card, Skeleton } from 'antd';
import styles from './ProductCard.module.scss';

export default function ProductCardSkeleton() {
  return (
    <Card
      className={styles.productCard}
      cover={
        <div className={styles.imageWrap}>
          <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
        </div>
      }
    >
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
  );
}
