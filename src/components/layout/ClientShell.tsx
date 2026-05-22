'use client';

import Header from '@/components/layout/Header';
import CartDrawer from '@/components/cart/CartDrawer';
import Footer from '@/components/layout/Footer';

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
