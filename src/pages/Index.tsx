
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MatchingSection from '@/components/MatchingSection';
import ServicesSection from '@/components/ServicesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MatchingSection />
      <ServicesSection />
    </div>
  );
};

export default Index;
