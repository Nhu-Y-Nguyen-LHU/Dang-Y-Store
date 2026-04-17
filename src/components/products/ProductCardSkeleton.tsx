'use client';

import Skeleton from '@/components/ui/Skeleton';
import styles from './ProductCard.module.scss';

export default function ProductCardSkeleton() {
  return (
    <div className={styles.productCard} aria-hidden="true">
      <div className={styles.imageContainer}>
        <div className={styles.imageLink}>
          <Skeleton className="h-full w-full" />
        </div>
      </div>
      <div className={styles.info}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    </div>
  );
}
