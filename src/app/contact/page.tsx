'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên.'),
  email: z.string().email('Email không hợp lệ.'),
  message: z.string().min(10, 'Nội dung cần ít nhất 10 ký tự.').max(1000, 'Nội dung quá dài.'),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
    mode: 'onTouched',
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <section>
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Liên hệ</div>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-zinc-950">Chúng tôi luôn lắng nghe</h1>
          <p className="mt-6 max-w-prose text-base leading-8 text-zinc-700">
            Hãy để lại lời nhắn. Đội ngũ Dáng Ý sẽ phản hồi trong thời gian sớm nhất để tư vấn sản phẩm,
            kích thước, chất liệu hoặc hỗ trợ đơn hàng.
          </p>

          <form
            className="mt-10 grid gap-5 rounded-xl border border-zinc-200 bg-white p-7"
            onSubmit={form.handleSubmit(() => {
              toast.success('Cảm ơn bạn. Dáng Ý sẽ liên hệ sớm.');
              form.reset();
            })}
          >
            <Field label="Họ và tên" required error={form.formState.errors.name?.message}>
              <input
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                autoComplete="name"
                {...form.register('name')}
              />
            </Field>

            <Field label="Email" required error={form.formState.errors.email?.message}>
              <input
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-[#722F37]"
                autoComplete="email"
                inputMode="email"
                {...form.register('email')}
              />
            </Field>

            <Field label="Nội dung" required error={form.formState.errors.message?.message}>
              <textarea
                className="min-h-32 w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#722F37]"
                {...form.register('message')}
              />
            </Field>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[#722F37] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
            >
              Gửi liên hệ
            </button>
          </form>

          <div className="mt-10 grid gap-4 rounded-xl border border-zinc-200 bg-white p-7">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Thông tin</div>
            <div className="grid gap-2 text-sm text-zinc-700">
              <div>
                <span className="text-zinc-500">Hotline:</span> 0900 000 000
              </div>
              <div>
                <span className="text-zinc-500">Email:</span> concierge@dang-y.vn
              </div>
              <div>
                <span className="text-zinc-500">Giờ làm việc:</span> 09:00 – 18:00 (T2–T7)
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden">
          <div className="p-8">
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Bản đồ (giả lập)</div>
            <div className="mt-3 font-serif text-2xl tracking-tight text-zinc-950">
              Studio Dáng Ý — Sài Gòn
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Không gian trưng bày tinh gọn, ưu tiên trải nghiệm cá nhân và tư vấn 1–1.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full border-t border-zinc-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(114,47,55,0.16),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0))]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-700">
                Map preview
              </div>
            </div>
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
