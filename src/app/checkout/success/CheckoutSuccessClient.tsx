'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessClient({ orderCode }: { orderCode: string }) {
  useEffect(() => {
    const colors = ['#722F37', '#4A1C21', '#FDFCFB', '#E4E4E7'];

    const burst = () => {
      confetti({
        particleCount: 70,
        spread: 65,
        startVelocity: 28,
        gravity: 0.95,
        scalar: 0.9,
        colors,
        origin: { x: 0.5, y: 0.35 },
      });
    };

    burst();
    const t = window.setTimeout(burst, 240);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-10 text-center">
        <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Dáng Ý</div>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-zinc-950">Cảm ơn quý khách</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Đơn hàng đã được ghi nhận. Đội ngũ Dáng Ý sẽ liên hệ để xác nhận và hoàn thiện trải nghiệm giao hàng.
        </p>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 px-6 py-5">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Mã đơn hàng</div>
          <div className="mt-2 font-mono text-lg tracking-tight text-zinc-950">{orderCode}</div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-[#722F37] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A1C21]"
          >
            Quay về Trang chủ
          </Link>
          <Link
            href="/wishlist"
            className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
          >
            Xem Yêu thích
          </Link>
        </div>
      </div>
    </main>
  );
}
