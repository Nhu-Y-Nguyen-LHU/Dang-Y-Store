export default function ShippingAndPaymentPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Chính sách</div>
        <h1 className="mt-3 font-serif text-5xl tracking-tight text-zinc-950">Giao hàng & thanh toán</h1>
        <p className="mt-6 text-base leading-8 text-zinc-700">
          Dáng Ý ưu tiên trải nghiệm giao nhận an toàn và minh bạch trong thanh toán.
        </p>

        <div className="mt-10 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">1) Giao hàng</div>
            <p className="mt-2">
              Thời gian giao hàng phụ thuộc khu vực. Đơn hàng sẽ được xác nhận qua hotline trước khi gửi.
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">2) Thanh toán</div>
            <p className="mt-2">
              Hỗ trợ thẻ tín dụng (giả lập trong bản demo), chuyển khoản và COD (tuỳ khu vực).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
