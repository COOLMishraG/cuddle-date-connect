
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MatchingSection from '@/components/MatchingSection';
import ServicesSection from '@/components/ServicesSection';
import WelcomeAlert from '@/components/WelcomeAlert';
import AuthStatus from '@/components/AuthStatus';
import Testimonials from '@/components/Testimonials';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Show testimonial toast notification once on first visit
  useEffect(() => {
    const hasSeenToast = localStorage.getItem('hasSeenTestimonialToast');
    
    if (!hasSeenToast) {
      // Wait a bit to let the page load
      const timer = setTimeout(() => {
        toast({
          title: "User Reviews",
          description: "Check out what our users say in the testimonials section!",
          variant: "default",
          duration: 5000,
        });
        localStorage.setItem('hasSeenTestimonialToast', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-[#FBE7E7]"> {/* Direct color override */}
      <Header />
      <div className="container mx-auto px-4 pt-6">
        <WelcomeAlert />
      </div>
      <HeroSection />
      {isAuthenticated && <MatchingSection />}
      <ServicesSection />
      <AuthStatus />
      <Testimonials />
    </div>
  );
};

export default Index;
