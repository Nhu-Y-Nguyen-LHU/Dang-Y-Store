'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Steps, Form, Input, Button, Radio, Card, Row, Col, Typography, Space, Divider, Empty, Alert, List, Avatar, Skeleton } from 'antd';
import { useCartStore, formatCurrencyVND } from '@/store/useCartStore';

const { Title, Text, Paragraph } = Typography;

type PaymentMethod = 'card' | 'bank' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const cart = useCartStore((s) => s.cart);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const subtotal = useMemo(() => totalPrice(), [totalPrice]);

  const stockViolations = useMemo(() => {
    return cart.filter(
      (item) => item.stockLimit !== null && item.quantity > item.stockLimit,
    );
  }, [cart]);

  const canCheckout = hasHydrated && cart.length > 0;

  if (!hasHydrated) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <Skeleton active paragraph={{ rows: 10 }} />
      </main>
    );
  }

  if (!canCheckout) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <Empty
          description="Giỏ hàng đang trống — hãy chọn một món đồ tinh tuyển trước."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href="/#products">
            <Button type="primary" size="large">Quay lại mua sắm</Button>
          </Link>
        </Empty>
      </main>
    );
  }

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields();
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const placeOrder = () => {
    const orderCode = `DY-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    clearCart();
    router.push(`/checkout/success?order=${encodeURIComponent(orderCode)}`);
  };

  const steps = [
    { title: 'Giao hàng' },
    { title: 'Thanh toán' },
    { title: 'Xác nhận' },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card variant="outlined" className="shadow-sm">
            <Title level={2}>Thanh toán</Title>
            <Paragraph type="secondary">
              Ba bước tinh gọn để hoàn tất đơn hàng — thanh lịch, mạch lạc và an tâm.
            </Paragraph>

            <Steps
              current={currentStep}
              items={steps}
              style={{ marginBottom: 40, marginTop: 24 }}
            />

            {currentStep === 0 && (
              <Form
                form={form}
                layout="vertical"
                initialValues={{ fullName: '', phone: '', address: '', city: '' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="email" label="Email (tùy chọn)">
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Địa chỉ giao hàng"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="Tỉnh/Thành phố"
                  rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item name="note" label="Ghi chú (tùy chọn)">
                  <Input.TextArea rows={4} />
                </Form.Item>

                <div className="flex justify-between items-center mt-8">
                  <Link href="/#products">
                    <Button type="link">← Tiếp tục mua sắm</Button>
                  </Link>
                  <Button type="primary" size="large" onClick={handleNext}>
                    Tiếp tục
                  </Button>
                </div>
              </Form>
            )}

            {currentStep === 1 && (
              <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Radio.Button value="card" style={{ width: '100%', height: 'auto', padding: 16 }}>
                        <Text strong>Thẻ tín dụng</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>Visa / MasterCard</Text>
                      </Radio.Button>
                    </Col>
                    <Col span={8}>
                      <Radio.Button value="bank" style={{ width: '100%', height: 'auto', padding: 16 }}>
                        <Text strong>Chuyển khoản</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>QR (giả lập)</Text>
                      </Radio.Button>
                    </Col>
                    <Col span={8}>
                      <Radio.Button value="cod" style={{ width: '100%', height: 'auto', padding: 16 }}>
                        <Text strong>COD</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>Thanh toán khi nhận</Text>
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>

                <Card className="bg-zinc-50">
                  {paymentMethod === 'card' && (
                    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                      <Text type="secondary">THÔNG TIN THẺ (GIẢ LẬP)</Text>
                      <Row gutter={16}>
                        <Col span={12}><Input placeholder="Số thẻ" /></Col>
                        <Col span={12}><Input placeholder="Tên chủ thẻ" /></Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}><Input placeholder="MM/YY" /></Col>
                        <Col span={12}><Input placeholder="CVC" /></Col>
                      </Row>
                    </Space>
                  )}
                  {paymentMethod === 'bank' && <Text>Vui lòng quét mã QR sau khi đặt hàng (giả lập).</Text>}
                  {paymentMethod === 'cod' && <Text>Thanh toán bằng tiền mặt khi nhận hàng.</Text>}
                </Card>

                <div className="flex justify-between items-center mt-8">
                  <Button onClick={() => setCurrentStep(0)}>← Quay lại</Button>
                  <Button type="primary" size="large" onClick={() => setCurrentStep(2)}>
                    Tiếp tục
                  </Button>
                </div>
              </Space>
            )}

            {currentStep === 2 && (
              <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                <Alert
                  message="Vui lòng kiểm tra lại thông tin trước khi đặt hàng."
                  type="info"
                  showIcon
                />
                <Card title="Thông tin xác nhận" bordered>
                  <Row gutter={32}>
                    <Col span={12}>
                      <Title level={5}>Giao hàng</Title>
                      <Text>{form.getFieldValue('fullName')}</Text><br />
                      <Text>{form.getFieldValue('phone')}</Text><br />
                      <Text>{form.getFieldValue('address')}, {form.getFieldValue('city')}</Text>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>Thanh toán</Title>
                      <Text>
                        {paymentMethod === 'card' ? 'Thẻ tín dụng' : paymentMethod === 'bank' ? 'Chuyển khoản' : 'COD'}
                      </Text>
                    </Col>
                  </Row>
                </Card>

                <div className="flex justify-between items-center mt-8">
                  <Button onClick={() => setCurrentStep(1)}>← Quay lại</Button>
                  <Button type="primary" size="large" onClick={placeOrder} danger={stockViolations.length > 0}>
                    Đặt hàng
                  </Button>
                </div>
                {stockViolations.length > 0 && (
                  <Alert message="Một số sản phẩm vượt quá tồn kho khả dụng." type="error" />
                )}
              </Space>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tóm tắt đơn hàng" className="shadow-sm">
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  extra={<Text strong>{formatCurrencyVND((item.unitPrice ?? item.product.price) * item.quantity)}</Text>}
                >
                  <List.Item.Meta
                    title={item.product.name}
                    description={`Số lượng: ${item.quantity}${item.variantName ? ` - ${item.variantName}` : ''}`}
                  />
                </List.Item>
              )}
            />
            <Divider />
            <div className="flex justify-between items-center">
              <Text>Tạm tính</Text>
              <Title level={4} style={{ margin: 0 }}>{formatCurrencyVND(subtotal)}</Title>
            </div>
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              Giá đã bao gồm thuế. Phí vận chuyển tính theo thực tế.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
