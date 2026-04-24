'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';
import { motion } from 'framer-motion';
import { formatCurrencyVND } from '@/store/useCartStore';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const primaryImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : '/images/products/nhan-kim-cuong.jpg';
  const variants = product.variants ?? [];
  const hasRenderableVariants = product.hasVariants && variants.length > 0;
  const variantPrices = variants.map((v) => v.price).filter((p) => Number.isFinite(p));
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;
  const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : product.price;

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
              src={primaryImage}
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
        <Link
          href={`/product/${product.slug}`}
          className={styles.quickViewButton}
          aria-label={`Xem nhanh sản phẩm ${product.name}`}
        >
          Xem nhanh
        </Link>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceSection}>
          {hasRenderableVariants ? (
            <>
              <p className={styles.price}>
                {formatCurrencyVND(minVariantPrice)} - {formatCurrencyVND(maxVariantPrice)}
              </p>
              <div className={styles.variantBadge}>
                {variants.some((v) => v.stock > 0) ? (
                  <span className={styles.inStock}>Có sẵn</span>
                ) : (
                  <span className={styles.outOfStock}>Hết hàng</span>
                )}
              </div>
            </>
          ) : (
            <p className={styles.price}>{formatCurrencyVND(product.price)}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
