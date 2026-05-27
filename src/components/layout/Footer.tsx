import Link from 'next/link';
import { FacebookFilled, InstagramOutlined, TikTokOutlined } from '@ant-design/icons';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>Dáng Ý</span>
            <p className={styles.brandDesc}>
              Dáng Ý — thời trang & phụ kiện cao cấp, tinh tuyển trong từng chi tiết. 
              Mang lại trải nghiệm mua sắm đẳng cấp và phong cách sống hiện đại.
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div>
              <div className={styles.sectionTitle}>Chính sách</div>
              <nav className={styles.linkList}>
                <Link href="/policies/returns" className={styles.link}>Chính sách đổi trả</Link>
                <Link href="/policies/shipping-payment" className={styles.link}>Giao hàng & Thanh toán</Link>
                <Link href="/policies/privacy" className={styles.link}>Bảo mật thông tin</Link>
                <Link href="/policies/warranty" className={styles.link}>Bảo hành sản phẩm</Link>
              </nav>
            </div>

            <div>
              <div className={styles.sectionTitle}>Hỗ trợ</div>
              <nav className={styles.linkList}>
                <Link href="/contact" className={styles.link}>Liên hệ</Link>
                <Link href="/about" className={styles.link}>Về chúng tôi</Link>
                <Link href="/story" className={styles.link}>Câu chuyện thương hiệu</Link>
                <Link href="/wishlist" className={styles.link}>Yêu thích</Link>
              </nav>
            </div>

            <div className={styles.socialCol}>
              <div className={styles.sectionTitle}>Kết nối</div>
              <div className={styles.socials}>
                <Link href="#" className={styles.socialLink} aria-label="Facebook"><FacebookFilled /></Link>
                <Link href="#" className={styles.socialLink} aria-label="Instagram"><InstagramOutlined /></Link>
                <Link href="#" className={styles.socialLink} aria-label="TikTok"><TikTokOutlined /></Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} Dáng Ý Store. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
