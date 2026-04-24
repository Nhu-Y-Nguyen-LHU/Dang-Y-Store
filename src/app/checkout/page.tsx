'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore, formatCurrencyVND } from '@/store/useCartStore';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên.'),
  phone: z
    .string()
    .min(8, 'Số điện thoại không hợp lệ.')
    .max(15, 'Số điện thoại không hợp lệ.')
    .regex(/^[0-9+\s()-]+$/, 'Số điện thoại không hợp lệ.'),
  email: z.string().email('Email không hợp lệ.').optional().or(z.literal('')),
  address: z.string().min(6, 'Vui lòng nhập địa chỉ.'),
  city: z.string().min(2, 'Vui lòng nhập Tỉnh/Thành phố.'),
  note: z.string().max(240, 'Ghi chú quá dài.').optional().or(z.literal('')),
});

type ShippingValues = z.infer<typeof shippingSchema>;

type PaymentMethod = 'card' | 'bank' | 'cod';

type Step = 1 | 2 | 3;

function StepPill({ step, current, label }: { step: Step; current: Step; label: string }) {
  const isActive = step === current;
  const isDone = step < current;

  return (
    <div className="flex items-center gap-3">
      <div
        className={
          'grid h-9 w-9 place-items-center rounded-full border text-sm font-medium ' +
          (isActive
            ? 'border-zinc-900 bg-zinc-950 text-white'
            : isDone
              ? 'border-zinc-200 bg-zinc-50 text-zinc-900'
              : 'border-zinc-200 bg-white text-zinc-500')
        }
      >
        {step}
      </div>
      <div className={isActive ? 'text-zinc-950' : 'text-zinc-500'}>
        <div className="text-xs uppercase tracking-[0.18em]">Bước {step}</div>
        <div className="font-serif text-base tracking-tight">{label}</div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();

  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const cart = useCartStore((s) => s.cart);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [shippingSnapshot, setShippingSnapshot] = useState<ShippingValues | null>(null);

  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      note: '',
    },
    mode: 'onTouched',
  });

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
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <div className="h-5 w-48 rounded bg-zinc-100" />
          <div className="mt-4 h-4 w-72 rounded bg-zinc-100" />
        </div>
      </main>
    );
  }

  if (!canCheckout) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-xl border border-zinc-200 bg-white p-8">
            <h1 className="font-serif text-3xl tracking-tight text-zinc-950">Thanh toán</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Giỏ hàng đang trống — hãy chọn một món đồ tinh tuyển trước.
            </p>

            <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-10 w-10 rounded-full bg-white ring-1 ring-zinc-200" />
                <div>
                  <div className="font-serif text-lg tracking-tight">Một khoảnh khắc tinh tế</div>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    Khi bạn đã sẵn sàng, Dáng Ý sẽ giúp hành trình mua sắm diễn ra trọn vẹn.
                  </p>
                  <Link
                    href="/#products"
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-[#722F37] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
                  >
                    Quay lại mua sắm
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-zinc-200 bg-white p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Tóm tắt</div>
            <div className="mt-2 font-serif text-xl tracking-tight">Tạm tính</div>
            <div className="mt-3 text-2xl text-zinc-950">{formatCurrencyVND(0)}</div>
          </aside>
        </div>
      </main>
    );
  }

  const placeOrder = () => {
    if (stockViolations.length > 0) {
      return;
    }

    const base = Date.now().toString(36).toUpperCase();
    const suffix = Math.floor(Math.random() * 900 + 100).toString();
    const orderCode = `DY-${base}-${suffix}`;

    clearCart();
    router.push(`/checkout/success?order=${encodeURIComponent(orderCode)}`);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-zinc-200 bg-white p-8">
          <h1 className="font-serif text-3xl tracking-tight text-zinc-950">Thanh toán</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Ba bước tinh gọn để hoàn tất đơn hàng — thanh lịch, mạch lạc và an tâm.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepPill step={1} current={step} label="Thông tin giao hàng" />
            <StepPill step={2} current={step} label="Phương thức thanh toán" />
            <StepPill step={3} current={step} label="Xác nhận" />
          </div>

          <div className="mt-10">
            {step === 1 && (
              <form
                className="grid grid-cols-1 gap-5"
                onSubmit={form.handleSubmit((values) => {
                  setShippingSnapshot(values);
                  setStep(2);
                })}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Họ và tên"
                    required
                    error={form.formState.errors.fullName?.message}
                  >
                    <input
                      className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                      autoComplete="name"
                      {...form.register('fullName')}
                    />
                  </Field>

                  <Field
                    label="Số điện thoại"
                    required
                    error={form.formState.errors.phone?.message}
                  >
                    <input
                      className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                      autoComplete="tel"
                      inputMode="tel"
                      {...form.register('phone')}
                    />
                  </Field>
                </div>

                <Field label="Email (tuỳ chọn)" error={form.formState.errors.email?.message}>
                  <input
                    className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                    autoComplete="email"
                    inputMode="email"
                    {...form.register('email')}
                  />
                </Field>

                <Field label="Địa chỉ giao hàng" required error={form.formState.errors.address?.message}>
                  <input
                    className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                    autoComplete="street-address"
                    {...form.register('address')}
                  />
                </Field>

                <Field label="Tỉnh/Thành phố" required error={form.formState.errors.city?.message}>
                  <input
                    className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                    autoComplete="address-level1"
                    {...form.register('city')}
                  />
                </Field>

                <Field label="Ghi chú (tuỳ chọn)" error={form.formState.errors.note?.message}>
                  <textarea
                    className="min-h-24 w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#722F37]"
                    {...form.register('note')}
                  />
                </Field>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <Link href="/#products" className="text-sm text-zinc-600 hover:text-zinc-900">
                    ← Tiếp tục mua sắm
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-[#722F37] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
                  >
                    Tiếp tục
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <PaymentOption
                    active={paymentMethod === 'card'}
                    title="Thẻ tín dụng"
                    subtitle="Visa / MasterCard"
                    onClick={() => setPaymentMethod('card')}
                  />
                  <PaymentOption
                    active={paymentMethod === 'bank'}
                    title="Chuyển khoản"
                    subtitle="QR (giả lập)"
                    onClick={() => setPaymentMethod('bank')}
                  />
                  <PaymentOption
                    active={paymentMethod === 'cod'}
                    title="COD"
                    subtitle="Thanh toán khi nhận"
                    onClick={() => setPaymentMethod('cod')}
                  />
                </div>

                {paymentMethod === 'card' && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Thông tin thẻ (giả lập)
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input
                        className="h-11 rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                        placeholder="Số thẻ"
                        inputMode="numeric"
                      />
                      <input
                        className="h-11 rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                        placeholder="Tên chủ thẻ"
                      />
                      <input
                        className="h-11 rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                        placeholder="MM/YY"
                      />
                      <input
                        className="h-11 rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                        placeholder="CVC"
                        inputMode="numeric"
                      />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-zinc-600">
                      Đây là giao diện mô phỏng để hoàn thiện trải nghiệm. Không có giao dịch thực.
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Chuyển khoản (giả lập)
                    </div>
                    <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr]">
                      <div className="grid aspect-square w-full place-items-center rounded-lg border border-zinc-200 bg-white">
                        <div className="text-center">
                          <div className="mx-auto h-28 w-28 rounded bg-zinc-100" />
                          <div className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
                            QR code
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-zinc-700">
                        <div>
                          <span className="text-zinc-500">Ngân hàng:</span> Dáng Ý Bank (giả lập)
                        </div>
                        <div>
                          <span className="text-zinc-500">Chủ tài khoản:</span> DÁNG Ý
                        </div>
                        <div>
                          <span className="text-zinc-500">Nội dung:</span> DANGY • Đơn hàng của bạn
                        </div>
                        <p className="pt-2 text-sm leading-6 text-zinc-600">
                          Sau khi chuyển khoản, đơn hàng sẽ được xác nhận thủ công để đảm bảo độ chính xác.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">COD</div>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      Thanh toán khi nhận hàng — lựa chọn an tâm cho những đơn đầu tiên.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center justify-center rounded-md bg-[#722F37] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Xác nhận</div>
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="font-serif text-lg tracking-tight">Giao hàng</div>
                      <div className="mt-2 space-y-1 text-sm text-zinc-700">
                        <div>{shippingSnapshot?.fullName}</div>
                        <div>{shippingSnapshot?.phone}</div>
                        {shippingSnapshot?.email ? <div>{shippingSnapshot.email}</div> : null}
                        <div>{shippingSnapshot?.address}</div>
                        <div>{shippingSnapshot?.city}</div>
                        {shippingSnapshot?.note ? (
                          <div className="pt-2 text-zinc-600">Ghi chú: {shippingSnapshot.note}</div>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <div className="font-serif text-lg tracking-tight">Thanh toán</div>
                      <div className="mt-2 text-sm text-zinc-700">
                        {paymentMethod === 'card'
                          ? 'Thẻ tín dụng'
                          : paymentMethod === 'bank'
                            ? 'Chuyển khoản'
                            : 'COD'}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Đơn hàng sẽ được xử lý ngay khi hoàn tất.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={stockViolations.length > 0}
                    className="inline-flex items-center justify-center rounded-md bg-[#722F37] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Đặt hàng
                  </button>
                </div>
                {stockViolations.length > 0 ? (
                  <p className="text-sm text-[#722F37]">
                    Một số sản phẩm đang vượt tồn kho. Vui lòng quay lại giỏ hàng để giảm số lượng.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-xl border border-zinc-200 bg-white p-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Tóm tắt</div>
              <div className="mt-1 font-serif text-xl tracking-tight text-zinc-950">Đơn hàng</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Tạm tính</div>
              <div className="mt-1 font-serif text-2xl tracking-tight text-zinc-950">
                {formatCurrencyVND(subtotal)}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div key={item.lineId ?? item.product.id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-base tracking-tight text-zinc-950">
                    {item.product.name}
                  </div>
                  {item.variantName ? (
                    <div className="mt-1 text-sm text-zinc-500">{item.variantName}</div>
                  ) : null}
                  <div className="mt-1 text-sm text-zinc-600">Số lượng: {item.quantity}</div>
                </div>
                <div className="text-sm text-zinc-900">
                  {formatCurrencyVND((item.unitPrice ?? item.product.price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Tổng cộng</span>
              <span className="font-serif text-lg tracking-tight text-zinc-950">
                {formatCurrencyVND(subtotal)}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Giá đã bao gồm thuế. Phí vận chuyển sẽ được xác nhận qua hotline.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-zinc-900">
          {label} {required ? <span className="text-[#722F37]">*</span> : null}
        </span>
        {error ? <span className="text-xs text-[#722F37]">{error}</span> : null}
      </div>
      {children}
    </label>
  );
}

function PaymentOption({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-lg border p-5 text-left transition-colors ' +
        (active
          ? 'border-zinc-900 bg-white'
          : 'border-zinc-200 bg-white hover:border-zinc-400')
      }
    >
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{subtitle}</div>
      <div className="mt-1 font-serif text-lg tracking-tight text-zinc-950">{title}</div>
    </button>
  );
}
