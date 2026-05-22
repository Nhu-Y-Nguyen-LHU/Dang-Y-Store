import { Suspense } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import ProductDiscoverySection from '@/components/sections/ProductDiscoverySection';
import { getAllProducts } from '@/lib/products';

export default function Home() {
  console.log('Force Reload 4');
  const products = getAllProducts();

  return (
    <div className="bg-white">
      <HeroSection />
      <section id="products">
        <Suspense fallback={<div className="h-96 flex items-center justify-center font-serif text-zinc-500">Đang tải dữ liệu...</div>}>
          <ProductDiscoverySection products={products} />
        </Suspense>
      </section>
    </div>
  );
}
