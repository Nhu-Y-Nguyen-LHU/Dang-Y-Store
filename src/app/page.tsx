import HeroSection from '@/components/sections/HeroSection';
import ProductDiscoveryDataSection from '@/components/sections/ProductDiscoveryDataSection';

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <section id="products">
        <ProductDiscoveryDataSection />
      </section>
    </div>
  );
}
