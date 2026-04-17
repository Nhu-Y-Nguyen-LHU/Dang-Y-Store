export default function WarrantyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Chính sách</div>
        <h1 className="mt-3 font-serif text-5xl tracking-tight text-zinc-950">Bảo hành</h1>
        <p className="mt-6 text-base leading-8 text-zinc-700">
          Một thiết kế cao cấp xứng đáng được chăm sóc lâu dài. Dáng Ý cung cấp chính sách
          bảo hành theo từng dòng sản phẩm.
        </p>

        <div className="mt-10 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">1) Phạm vi</div>
            <p className="mt-2">
              Lỗi kỹ thuật phát sinh trong quá trình chế tác hoặc vật liệu (không bao gồm hao mòn tự nhiên).
            </p>
          </section>
          <section>
            <div className="font-serif text-xl tracking-tight text-zinc-950">2) Hỗ trợ</div>
            <p className="mt-2">
              Vui lòng liên hệ concierge@dang-y.vn kèm mã đơn hàng và hình ảnh để được tư vấn.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
