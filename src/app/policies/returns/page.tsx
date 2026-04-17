export default function ReturnsPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Chính sách</div>
        <h1 className="mt-3 font-serif text-5xl tracking-tight text-zinc-950">Chính sách đổi trả</h1>
        <p className="mt-6 text-base leading-8 text-zinc-700">
          Chúng tôi mong mọi trải nghiệm đều trọn vẹn. Nếu cần đổi trả, Dáng Ý hỗ trợ theo
          các điều kiện dưới đây.
        </p>

        <div className="mt-10 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">1) Thời hạn</div>
            <p className="mt-2">Hỗ trợ trong vòng 07 ngày kể từ khi nhận hàng (tuỳ sản phẩm).</p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">2) Điều kiện</div>
            <p className="mt-2">
              Sản phẩm chưa qua sử dụng, còn đầy đủ phụ kiện/bao bì, và không bị tác động vật lý.
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">3) Quy trình</div>
            <p className="mt-2">
              Liên hệ concierge@dang-y.vn với mã đơn hàng, hình ảnh sản phẩm và lý do đổi trả.
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">4) Hoàn tiền</div>
            <p className="mt-2">
              Hoàn tiền theo phương thức thanh toán ban đầu sau khi kiểm tra và xác nhận.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
