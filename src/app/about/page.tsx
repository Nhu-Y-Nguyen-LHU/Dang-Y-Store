'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutPage() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -90]);
  const opacity = useTransform(scrollY, [0, 450], [1, 0.35]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <section>
          <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Câu chuyện</div>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-zinc-950 md:text-6xl">
            Dáng Ý
          </h1>
          <p className="mt-6 max-w-prose text-base leading-8 text-zinc-700">
            Dáng Ý được sinh ra từ một niềm tin giản dị: vẻ đẹp đích thực không cần ồn ào.
            Từ đường cắt, chất liệu cho đến tỷ lệ thị giác — mọi thứ đều hướng đến một cảm giác “đúng”
            khi chạm vào, khi nhìn thấy, và khi mang theo.
          </p>
          <p className="mt-5 max-w-prose text-base leading-8 text-zinc-700">
            Chúng tôi làm việc chậm rãi, có chủ đích. Tối giản không phải là bớt đi giá trị — mà là
            chọn lọc để phần tinh tuý được ở lại. Mỗi thiết kế là một lời mời: sống thanh lịch, nhẹ nhàng,
            và bền vững theo thời gian.
          </p>

          <div className="mt-10 grid gap-4 rounded-xl border border-zinc-200 bg-white p-7">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Triết lý</div>
            <div className="grid gap-3 text-sm leading-7 text-zinc-700">
              <div>
                <span className="font-medium text-zinc-950">Chất liệu</span>: ưu tiên độ bền, cảm giác chạm,
                và sự tinh tế khi lên form.
              </div>
              <div>
                <span className="font-medium text-zinc-950">Kỹ nghệ</span>: thủ công chuẩn xác, tôn trọng
                những chi tiết nhỏ nhất.
              </div>
              <div>
                <span className="font-medium text-zinc-950">Tối giản</span>: giữ lại điều cần thiết để vẻ đẹp
                trở nên rõ ràng.
              </div>
            </div>
          </div>
        </section>

        <aside className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(114,47,55,0.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(74,28,33,0.14),transparent_60%)]" />
          </motion.div>

          <div className="relative p-8">
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Một mảng cảm hứng</div>
            <div className="mt-3 font-serif text-2xl tracking-tight text-zinc-950">
              Tối giản, nhưng không đơn điệu.
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-700">
              Parallax nhẹ khi cuộn trang tạo cảm giác chiều sâu — như một lớp vải rũ mềm dưới ánh sáng.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Cam kết</div>
                <div className="mt-2 text-sm leading-7 text-zinc-700">
                  Trải nghiệm mua sắm mạch lạc, thông tin rõ ràng và dịch vụ chăm sóc tận tâm.
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Tinh tuyển</div>
                <div className="mt-2 text-sm leading-7 text-zinc-700">
                  Mỗi sản phẩm là một lựa chọn có chủ đích — đủ khác biệt để trở nên đáng nhớ.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
