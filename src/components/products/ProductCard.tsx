'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';
import { motion } from 'framer-motion';
import { formatCurrencyVND, useCartStore } from '@/store/useCartStore';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isWishlisted = useCartStore((s) => s.isWishlisted(product.id));

  return (
    <motion.div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <Link href={`/product/${product.slug}`} className={styles.imageLink} aria-label={product.name}>
          <motion.div
            className={styles.imageMotion}
            layoutId={`product-image-${product.id}`}
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <Image
              src={product.images[0]} // Display the first image
              alt={product.name}
              fill
              className={styles.productImage}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
            />
          </motion.div>
        </Link>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={styles.wishlistButton}
          aria-label={isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart
            size={18}
            className={isWishlisted ? styles.wishlistIconActive : styles.wishlistIcon}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>
        <button className={styles.quickViewButton}>Xem nhanh</button>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatCurrencyVND(product.price)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
