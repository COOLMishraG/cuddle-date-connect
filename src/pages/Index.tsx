
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
    <div className="min-h-screen bg-[#FBE7E7] relative"> {/* Direct color override */}
      {/* Floating Background Shapes - Enhanced with more emojis */}
      <div className="floating-shape absolute top-[8%] left-[10%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[15%] right-[12%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[25%] left-[8%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[30%] left-[40%] text-2xl float-1" style={{ animationDelay: '2s' }}>🏠</div>
      <div className="floating-shape absolute bottom-[30%] right-[30%] text-3xl float-2" style={{ animationDelay: '3s' }}>🩺</div>
      <div className="floating-shape absolute top-[50%] right-[8%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[15%] left-[45%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐕</div>
      
      {/* Additional floating emojis for homepage */}
      <div className="floating-shape absolute top-[12%] left-[70%] text-3xl float-2" style={{ animationDelay: '1.5s' }}>🐱</div>
      <div className="floating-shape absolute top-[65%] left-[20%] text-2xl float-3" style={{ animationDelay: '2.5s' }}>🦴</div>
      <div className="floating-shape absolute bottom-[45%] left-[80%] text-4xl float-1" style={{ animationDelay: '3.5s' }}>🎾</div>
      <div className="floating-shape absolute top-[80%] right-[50%] text-3xl float-2" style={{ animationDelay: '0.5s' }}>🐕‍🦺</div>
      <div className="floating-shape absolute top-[35%] left-[60%] text-2xl float-3" style={{ animationDelay: '4.5s' }}>🦮</div>
      <div className="floating-shape absolute bottom-[70%] right-[20%] text-5xl float-1" style={{ animationDelay: '1.8s' }}>💙</div>
      <div className="floating-shape absolute top-[90%] left-[30%] text-3xl float-2" style={{ animationDelay: '3.2s' }}>🐾</div>
      <div className="floating-shape absolute bottom-[8%] right-[70%] text-2xl float-3" style={{ animationDelay: '2.8s' }}>🍖</div>
      <div className="floating-shape absolute top-[25%] left-[50%] text-4xl float-1" style={{ animationDelay: '4.2s' }}>🧸</div>
      <div className="floating-shape absolute bottom-[40%] left-[30%] text-3xl float-2" style={{ animationDelay: '0.8s' }}>🎈</div>
      <div className="floating-shape absolute top-[60%] right-[40%] text-2xl float-3" style={{ animationDelay: '3.8s' }}>🏆</div>
      <div className="floating-shape absolute bottom-[55%] left-[65%] text-4xl float-1" style={{ animationDelay: '1.2s' }}>🌟</div>
      <div className="floating-shape absolute top-[75%] left-[85%] text-3xl float-2" style={{ animationDelay: '4.8s' }}>🦊</div>
      <div className="floating-shape absolute top-[5%] left-[25%] text-2xl float-3" style={{ animationDelay: '2.2s' }}>🐰</div>
      <div className="floating-shape absolute bottom-[20%] right-[10%] text-4xl float-1" style={{ animationDelay: '3.7s' }}>🐈‍⬛</div>
      <div className="floating-shape absolute top-[45%] left-[15%] text-3xl float-2" style={{ animationDelay: '1.9s' }}>🌸</div>
      <div className="floating-shape absolute bottom-[60%] right-[60%] text-2xl float-3" style={{ animationDelay: '4.3s' }}>🐦</div>
      <div className="floating-shape absolute top-[85%] left-[55%] text-4xl float-1" style={{ animationDelay: '0.3s' }}>💜</div>
      
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
