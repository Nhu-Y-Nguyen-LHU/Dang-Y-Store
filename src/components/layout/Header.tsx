'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';

export default function Header() {
  const pathname = usePathname();
  const cartHydrated = useCartStore((s) => s.hasHydrated);
  const wishlistHydrated = useWishlistStore((s) => s.hasHydrated);
  const hasHydrated = cartHydrated && wishlistHydrated;
  const toggleCart = useUIStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalWishlistItems = useWishlistStore((s) => s.totalWishlistItems());

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    if (href === '/policies') return pathname.startsWith('/policies');
    return pathname === href;
  };

  const [bump, setBump] = useState(false);
  const prevItemsRef = useRef(totalItems);

  useEffect(() => {
    if (!hasHydrated) return;

    const prev = prevItemsRef.current;
    if (totalItems > prev) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 420);
      return () => window.clearTimeout(t);
    }

    prevItemsRef.current = totalItems;
  }, [totalItems, hasHydrated]);

  useEffect(() => {
    prevItemsRef.current = totalItems;
  }, [totalItems]);

  const badge = useMemo(() => {
    if (!hasHydrated || totalItems <= 0) return null;
    return (
      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#722F37] px-1 text-[11px] font-medium leading-none text-white">
        {totalItems > 99 ? '99+' : totalItems}
      </span>
    );
  }, [hasHydrated, totalItems]);

  const wishlistBadge = useMemo(() => {
    if (!hasHydrated || totalWishlistItems <= 0) return null;
    return (
      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#722F37] px-1 text-[11px] font-medium leading-none text-white">
        {totalWishlistItems > 99 ? '99+' : totalWishlistItems}
      </span>
    );
  }, [hasHydrated, totalWishlistItems]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-lg tracking-tight text-zinc-950">
          Dáng Ý
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Điều hướng chính">
          <Link
            href="/about"
            className={
              "text-sm transition-colors hover:text-zinc-950 " +
              (isActive('/about') ? 'text-[#722F37] font-medium' : 'text-zinc-700')
            }
          >
            Về Dáng Ý
          </Link>
          <Link
            href="/contact"
            className={
              "text-sm transition-colors hover:text-zinc-950 " +
              (isActive('/contact') ? 'text-[#722F37] font-medium' : 'text-zinc-700')
            }
          >
            Liên hệ
          </Link>
          <Link
            href="/policies/privacy"
            className={
              "text-sm transition-colors hover:text-zinc-950 " +
              (isActive('/policies') ? 'text-[#722F37] font-medium' : 'text-zinc-700')
            }
          >
            Chính sách
          </Link>
          <Link
            href="/checkout"
            className={
              "text-sm font-medium transition-colors hover:text-[#4A1C21] " +
              (isActive('/checkout') ? 'text-[#722F37]' : 'text-zinc-700')
            }
          >
            Thanh toán
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            className={
              'hidden items-center justify-center rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 hover:text-[#4A1C21] sm:inline-flex md:hidden ' +
              (isActive('/checkout') ? 'text-[#722F37]' : 'text-zinc-900')
            }
          >
            Thanh toán
          </Link>

          <Link
            href="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/70 text-zinc-950 transition-colors hover:bg-zinc-50"
            aria-label="Xem danh sách yêu thích"
          >
            <Heart size={18} />
            {wishlistBadge}
          </Link>

          <motion.button
            type="button"
            onClick={toggleCart}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/70 text-zinc-950 transition-colors hover:bg-zinc-50"
            animate={bump ? { scale: [1, 1.09, 1] } : { scale: 1 }}
            transition={{ duration: 0.45, ease: [0.43, 0.13, 0.23, 0.96] }}
            aria-label="Mở giỏ hàng"
          >
            <ShoppingBag size={18} />
            {badge}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
