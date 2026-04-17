'use client';

import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>Dáng Ý</div>
            <p className={styles.text}>
              Dáng Ý là lời tuyên ngôn của vẻ đẹp tối giản — nơi chất liệu thượng hạng
              và kỹ nghệ thủ công hòa quyện để tạo nên những món đồ có giá trị bền vững theo
              thời gian.
            </p>
          </div>

          <div>
            <div className={styles.title}>Dịch vụ khách hàng</div>
            <nav className={styles.list}>
              <Link href="/policies/returns" className={styles.link}>
                Chính sách đổi trả
              </Link>
              <Link href="/policies/warranty" className={styles.link}>
                Bảo hành
              </Link>
              <Link href="/policies/shipping-payment" className={styles.link}>
                Giao hàng & thanh toán
              </Link>
              <Link href="/policies/privacy" className={styles.link}>
                Chính sách bảo mật
              </Link>
              <Link href="/contact" className={styles.link}>
                Liên hệ
              </Link>
            </nav>
          </div>

          <div>
            <div className={styles.title}>Kết nối</div>
            <nav className={styles.list}>
              <Link href="https://instagram.com" className={styles.link} target="_blank" rel="noreferrer">
                Instagram
              </Link>
              <Link href="https://facebook.com" className={styles.link} target="_blank" rel="noreferrer">
                Facebook
              </Link>
              <Link href="/about" className={styles.link}>
                Câu chuyện Dáng Ý
              </Link>
            </nav>
          </div>

          <div>
            <div className={styles.title}>Newsletter</div>
            <p className={styles.text}>
              Nhận những cập nhật tinh tuyển về bộ sưu tập mới, câu chuyện chế tác và đặc quyền
              dành riêng cho bạn.
            </p>
            <form
              className={styles.newsletterRow}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                className={styles.input}
                type="email"
                placeholder="Email của bạn"
                aria-label="Email"
                required
              />
              <button className={styles.button} type="submit">
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.small}>
            © {new Date().getFullYear()} Dáng Ý. Tất cả quyền được bảo lưu.
          </p>
          <p className={styles.small}>Thiết kế tối giản — tinh tế, lịch lãm.</p>
        </div>
      </div>
    </footer>
  );
}
