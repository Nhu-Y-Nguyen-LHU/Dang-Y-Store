"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StoryBlock = {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

const blocks: StoryBlock[] = [
  {
    title: "Chạm vào chất liệu",
    body: "Khi bạn cuộn, hình ảnh nổi lên theo nhịp — từ mờ sang rõ, như một câu chuyện đang được “kể” bằng chuyển động.",
    imageSrc: "/images/products/nhan-kim-cuong.jpg",
    imageAlt: "Nhẫn kim cương",
  },
  {
    title: "Tông đỏ rượu vang",
    body: "Các khối nội dung di chuyển so le (parallax). Text và hình “đối thoại” với nhau, tạo chiều sâu thị giác.",
    imageSrc: "/images/products/khan-lua.jpg",
    imageAlt: "Khăn lụa",
  },
  {
    title: "Tinh tế & tối giản",
    body: "Hiệu ứng blur-to-clear giúp dẫn mắt vào điểm nhấn. Mỗi đoạn là một nhịp nghỉ trước khi sang cảnh tiếp theo.",
    imageSrc: "/images/products/khuyen-ngoc-trai.jpg",
    imageAlt: "Khuyên ngọc trai",
  },
  {
    title: "Hoàn thiện trải nghiệm",
    body: "ScrollTrigger đồng bộ chuyển động với cuộn trang (scrub), để chuyển cảnh mượt và “đã tay” trên cả desktop lẫn mobile.",
    imageSrc: "/images/products/vong-tay.webp",
    imageAlt: "Vòng tay",
  },
];

export default function StoryClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = Array.from(
        rootRef.current!.querySelectorAll<HTMLElement>("[data-story-section]")
      );

      sections.forEach((section, index) => {
        const media = section.querySelector<HTMLElement>("[data-story-media]");
        const copy = section.querySelector<HTMLElement>("[data-story-copy]");

        const direction = index % 2 === 0 ? 1 : -1;

        if (media) {
          gsap.fromTo(
            media,
            { y: 80 * direction, filter: "blur(14px)", opacity: 0.55 },
            {
              immediateRender: false,
              y: -80 * direction,
              filter: "blur(0px)",
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                scrub: true,
              },
            }
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { y: -48 * direction, filter: "blur(10px)", opacity: 0.25 },
            {
              immediateRender: false,
              y: 48 * direction,
              filter: "blur(0px)",
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "bottom 30%",
                scrub: true,
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-4 pt-14 md:pt-20">
        <h1 className="font-heading text-3xl md:text-5xl">Story</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Scrollytelling demo với GSAP ScrollTrigger: parallax so le và hiệu ứng
          blur-to-clear theo cuộn trang.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:pb-28 md:pt-14">
        <div className="space-y-16 md:space-y-24">
          {blocks.map((block, index) => (
            <section
              key={block.title}
              data-story-section
              className="border-border/70 bg-card/30 relative overflow-hidden rounded-3xl border"
            >
              <div
                className={
                  "grid items-center gap-8 p-5 md:grid-cols-2 md:gap-12 md:p-12 " +
                  (index % 2 === 0 ? "" : "md:[&>*:first-child]:order-2")
                }
              >
                <div data-story-media className="will-change-transform">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                    <Image
                      src={block.imageSrc}
                      alt={block.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </div>

                <div data-story-copy className="will-change-transform">
                  <h2 className="font-heading text-2xl md:text-3xl">
                    {block.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground md:text-lg">
                    {block.body}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
