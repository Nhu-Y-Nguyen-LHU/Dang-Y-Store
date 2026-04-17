export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Chính sách</div>
        <h1 className="mt-3 font-serif text-5xl tracking-tight text-zinc-950">Chính sách bảo mật</h1>
        <p className="mt-6 text-base leading-8 text-zinc-700">
          Dáng Ý tôn trọng quyền riêng tư của bạn. Trang này mô tả cách chúng tôi thu thập,
          sử dụng và bảo vệ thông tin khi bạn tương tác với website.
        </p>

        <div className="mt-10 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">1) Dữ liệu thu thập</div>
            <p className="mt-2">
              Thông tin liên hệ (họ tên, số điện thoại, email), địa chỉ giao hàng và dữ liệu cần thiết
              để xử lý đơn hàng.
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">2) Mục đích sử dụng</div>
            <p className="mt-2">
              Xác nhận đơn hàng, hỗ trợ khách hàng, nâng cao trải nghiệm và đảm bảo an toàn giao dịch.
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">3) Bảo mật</div>
            <p className="mt-2">
              Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ dữ liệu. Tuy nhiên, không có hệ thống
              nào đảm bảo an toàn tuyệt đối.
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">4) Liên hệ</div>
            <p className="mt-2">
              Nếu có câu hỏi, vui lòng liên hệ: concierge@dang-y.vn
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
