'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import styles from './CartDrawer.module.scss';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrencyVND } from '@/store/useCartStore';

const easeLuxury: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { duration: 0.5, ease: easeLuxury }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.4, ease: easeLuxury }
  }
};

const CartDrawer = () => {
  const isOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const cart = useCartStore((s) => s.cart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  if (!hasHydrated) return null;

  const subtotal = totalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeCart}
          />
          <motion.div
            className={styles.drawer}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <header className={styles.header}>
              <h2 className={styles.title}>Giỏ hàng</h2>
              <button onClick={closeCart} className={styles.closeButton} aria-label="Đóng giỏ hàng">
                <X size={24} />
              </button>
            </header>

            <div className={styles.body}>
              {cart.length === 0 ? (
                <div className={styles.emptyMessage}>
                  <div className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-zinc-200 bg-white">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 7h14l-1.2 7.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L6 3H3"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 20a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm9 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm leading-6">Giỏ hàng của bạn hiện đang trống.</p>
                  <Link
                    href="/#products"
                    onClick={closeCart}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-[#722F37] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
                  >
                    Quay lại mua sắm
                  </Link>
                </div>
              ) : (
                <div className={styles.items}>
                  {cart.map((item) => (
                    <div key={item.product.id} className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                        />
                      </div>

                      <div className={styles.itemInfo}>
                        <div className={styles.itemTop}>
                          <div>
                            <p className={styles.itemName}>{item.product.name}</p>
                            <p className={styles.itemPrice}>
                              {formatCurrencyVND(item.product.price)}
                            </p>
                          </div>
                          <button
                            className={styles.removeButton}
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Xoá sản phẩm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className={styles.itemBottom}>
                          <div className={styles.qtyControls}>
                            <button
                              className={styles.qtyButton}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Giảm số lượng"
                            >
                              <Minus size={16} />
                            </button>
                            <span className={styles.qtyValue}>{item.quantity}</span>
                            <button
                              className={styles.qtyButton}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Tăng số lượng"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className={styles.lineTotal}>
                            {formatCurrencyVND(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <footer className={styles.footer}>
                <div className={styles.subtotal}>
                  <span className={styles.label}>Tạm tính</span>
                  <span className={styles.amount}>{formatCurrencyVND(subtotal)}</span>
                </div>
                <Link href="/checkout" className={styles.checkoutButton} onClick={closeCart}>
                  Thanh toán
                </Link>
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
