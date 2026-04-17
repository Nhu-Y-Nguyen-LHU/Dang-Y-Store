'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import CartDrawer from '@/components/cart/CartDrawer';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import Lenis from 'lenis';

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    let cleanupTicker: (() => void) | null = null;
    let cleanupScrollBridge: (() => void) | null = null;
    let isCancelled = false;

    (async () => {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');
        if (isCancelled) return;

        const gsap =
          (gsapModule as unknown as { default?: any; gsap?: any }).default ??
          (gsapModule as unknown as { default?: any; gsap?: any }).gsap ??
          gsapModule;

        const ScrollTrigger =
          (scrollTriggerModule as unknown as { ScrollTrigger?: any; default?: any })
            .ScrollTrigger ??
          (scrollTriggerModule as unknown as { ScrollTrigger?: any; default?: any })
            .default;

        gsap.registerPlugin(ScrollTrigger);

        const onLenisScroll = () => ScrollTrigger.update();
        lenis.on('scroll', onLenisScroll);
        cleanupScrollBridge = () => lenis.off('scroll', onLenisScroll);

        const ticker = (timeSeconds: number) => {
          lenis.raf(timeSeconds * 1000);
          ScrollTrigger.update();
        };
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        cleanupTicker = () => gsap.ticker.remove(ticker);

        ScrollTrigger.refresh();
      } catch {
        let rafId = 0;
        const raf = (time: number) => {
          lenis.raf(time);
          rafId = window.requestAnimationFrame(raf);
        };
        rafId = window.requestAnimationFrame(raf);
        cleanupTicker = () => window.cancelAnimationFrame(rafId);
      }
    })();

    return () => {
      isCancelled = true;
      cleanupScrollBridge?.();
      cleanupTicker?.();
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
