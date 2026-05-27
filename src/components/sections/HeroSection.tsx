'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSection.module.scss';

const easeElite: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <motion.span
            className={styles.kicker}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tinh tuyển cao cấp
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Dáng Ý —<br />
            Tối giản, nhưng<br />để lại dư âm.
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Mỗi thiết kế được tạo nên bằng sự chuẩn xác thầm lặng và dấu ấn đỏ rượu tinh tế —
            sang trọng, tiết chế, và mang tính cá nhân rõ rệt.
          </motion.p>

          <motion.div
            className={styles.actionRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/products" className={styles.primaryBtn}>
              Khám phá ngay
            </Link>
            <Link href="/about" className={styles.secondaryBtn}>
              Về thương hiệu
            </Link>
          </motion.div>

          <motion.div 
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className={styles.statItem}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Sản phẩm tinh tuyển</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>24h</span>
              <span className={styles.statLabel}>Giao hàng hỏa tốc</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: easeElite }}
        >
          <div className={styles.imageContainer}>
            <Image
              src="/images/products/mdny-001_v2.jpg"
              alt="Dáng Ý Luxury Collection"
              fill
              className={styles.heroImage}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              loading="eager"
            />
            <div className={styles.imageOverlay}>
              <div className={styles.overlayBrand}>
                <div className={styles.brandLine} />
                <p className={styles.brandTitle}>Dáng Ý Signature</p>
                <div className={styles.brandLine} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
