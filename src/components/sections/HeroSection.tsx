'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './HeroSection.module.scss';

const easeElite: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <motion.p
          className={styles.kicker}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeElite }}
        >
          Tinh tuyển cao cấp
        </motion.p>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: easeElite }}
        >
          Dáng Ý —
          <br />
          Tối giản, nhưng để lại dư âm.
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: easeElite }}
        >
          Mỗi thiết kế được tạo nên bằng sự chuẩn xác thầm lặng và dấu ấn đỏ rượu tinh tế —
          sang trọng, tiết chế, và mang tính cá nhân rõ rệt.
        </motion.p>

        <motion.div
          className={styles.ctaRow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: easeElite }}
        >
          <Link href="#products" className={styles.primaryCta}>
            Khám phá ngay
          </Link>
          <Link href="/product/the-dang-y-signature-ring" className={styles.secondaryCta}>
            Sở hữu mẫu Signature
          </Link>
        </motion.div>

        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.24, ease: easeElite }}
        >
          <div className={styles.panelInner}>
            <p className={styles.panelTitle}>Cam kết Dáng Ý</p>
            <p className={styles.panelLine}>
              Dấu ấn <span className={styles.wineAccent}>đỏ rượu</span> tinh tế,
              chất liệu thượng hạng, và phom dáng vượt thời gian.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
