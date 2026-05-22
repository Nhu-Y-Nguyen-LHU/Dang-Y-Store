'use client';

import Link from 'next/link';
import { Drawer, Button, Space, Typography, Empty, Avatar } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './CartDrawer.module.scss';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { formatCurrencyVND } from '@/store/useCartStore';

const { Title, Text } = Typography;

const CartDrawer = () => {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const cart = useCartStore((s) => s.cart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  if (!hasHydrated) return null;

  const subtotal = totalPrice();

  return (
    <Drawer
      title={<Title level={4} style={{ margin: 0 }}>Giỏ hàng</Title>}
      placement="right"
      onClose={closeCart}
      open={isOpen}
      size="default"
      footer={
        cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <Text type="secondary">Tạm tính</Text>
              <Title level={4} style={{ margin: 0 }}>{formatCurrencyVND(subtotal)}</Title>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button type="primary" block size="large" style={{ marginTop: 16 }}>
                Thanh toán
              </Button>
            </Link>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <Empty
          description="Giỏ hàng của bạn hiện đang trống."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href="/#products" onClick={closeCart}>
            <Button type="primary">Quay lại mua sắm</Button>
          </Link>
        </Empty>
      ) : (
        <div className={styles.cartList}>
          {cart.map((item) => (
            <div className={styles.cartItem} key={item.lineId ?? item.product.id}>
              <Avatar
                shape="square"
                size={64}
                src={item.product.images[0]}
              />
              <div className={styles.cartInfo}>
                <Text strong className={styles.cartTitle}>{item.product.name}</Text>
                <Space orientation="vertical" size={0} className={styles.cartMeta}>
                  {item.variantName && <Text type="secondary" className={styles.cartVariant}>{item.variantName}</Text>}
                  <Text>{formatCurrencyVND(item.unitPrice ?? item.product.price)}</Text>
                </Space>
              </div>
              <div className={styles.cartActions}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeItem(item.lineId ?? item.product.id)}
                />
                <Space size="small">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => updateQuantity(item.lineId ?? item.product.id, item.quantity - 1)}
                  />
                  <Text>{item.quantity}</Text>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => updateQuantity(item.lineId ?? item.product.id, item.quantity + 1)}
                    disabled={item.stockLimit !== null && item.quantity >= item.stockLimit}
                  />
                </Space>
                <Text strong>{formatCurrencyVND((item.unitPrice ?? item.product.price) * item.quantity)}</Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
