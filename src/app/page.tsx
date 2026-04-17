import HeroSection from '@/components/sections/HeroSection';
import ProductDiscoverySection from '@/components/sections/ProductDiscoverySection';
import { mockProducts } from '@/data/products';

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <section id="products">
        <ProductDiscoverySection products={mockProducts} />
      </section>
    </div>
  );
}
