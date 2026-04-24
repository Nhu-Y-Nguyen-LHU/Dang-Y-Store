'use client';

import { useRef } from 'react';
import { getAllProducts } from '@/lib/products';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import styles from './ProductGrid.module.scss';
import { motion, useInView } from 'framer-motion';
import type { Product } from '@/types/product';

const easeLuxury: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

type ProductGridProps = {
  products?: Product[];
  loading?: boolean;
  skeletonCount?: number;
};

const ProductGrid = ({
  products = getAllProducts(),
  loading = false,
  skeletonCount = 8,
}: ProductGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const safeProducts = products.filter((product) => {
    return Boolean(product && product.id && product.name);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: easeLuxury,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeLuxury,
      },
    },
  };

  return (
    <section className={styles.productGridContainer} ref={ref}>
      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <motion.div key={`skeleton-${idx}`} variants={cardVariants}>
                <ProductCardSkeleton />
              </motion.div>
            ))
          : safeProducts.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
};

export default ProductGrid;
