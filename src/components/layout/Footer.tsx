import Link from 'next/link';
import { FacebookFilled, InstagramOutlined, TikTokOutlined } from '@ant-design/icons';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topMeta}>
          <p className={styles.metaTitle}>Sàn thương mại điện tử Dáng Ý</p>
          <p className={styles.metaText}>
            Mua sắm an toàn với quy trình thanh toán bảo mật và vận chuyển toàn quốc.
          </p>
        </div>

        <div className={styles.grid}>
          <div>
            <div className={styles.title}>Thông tin công ty</div>
            <p className={styles.text}>
              Dáng Ý Store JSC
              <br />
              Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM
              <br />
              MST: 0312-XXX-XXX
              <br />
              Hotline: 1900 1234
            </p>
          </div>

          <div>
            <div className={styles.title}>Chính sách mua hàng</div>
            <nav className={styles.list}>
              <Link href="/policies/returns" className={styles.link}>
                Chính sách đổi trả
              </Link>
              <Link href="/policies/shipping-payment" className={styles.link}>
                Giao hàng & thanh toán
              </Link>
              <Link href="/policies/privacy" className={styles.link}>
                Chính sách bảo mật
              </Link>
              <Link href="/policies/warranty" className={styles.link}>
                Bảo hành sản phẩm
              </Link>
            </nav>
          </div>

          <div>
            <div className={styles.title}>Hỗ trợ khách hàng</div>
            <nav className={styles.list}>
              <Link href="/contact" className={styles.link}>
                Liên hệ
              </Link>
              <Link href="/about" className={styles.link}>
                Giới thiệu thương hiệu
              </Link>
              <Link href="/checkout" className={styles.link}>
                Hướng dẫn thanh toán
              </Link>
              <Link href="/wishlist" className={styles.link}>
                Danh sách yêu thích
              </Link>
            </nav>
          </div>

          <div>
            <div className={styles.title}>Kết nối mạng xã hội</div>
            <p className={styles.text}>
              Theo dõi Dáng Ý để nhận ưu đãi, livestream và xu hướng sản phẩm mới mỗi tuần.
            </p>

            <div className={styles.socialRow}>
              <Link
                href="https://facebook.com"
                className={styles.socialLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FacebookFilled />
              </Link>
              <Link
                href="https://instagram.com"
                className={styles.socialLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramOutlined />
              </Link>
              <Link
                href="https://tiktok.com"
                className={styles.socialLink}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <TikTokOutlined />
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.small}>
            © {new Date().getFullYear()} Dáng Ý. Tất cả quyền được bảo lưu.
          </p>
          <p className={styles.small}>Giấy phép sàn TMĐT số 2026/DANGY/ECOM.</p>
        </div>
      </div>
    </footer>
  );
}
