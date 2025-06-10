
import { Heart, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="floating-shape top-20 left-10 text-4xl float-1">💕</div>
      <div className="floating-shape top-32 right-20 text-3xl float-2">🐾</div>
      <div className="floating-shape bottom-40 left-16 text-5xl float-3">❤️</div>
      <div className="floating-shape top-60 left-1/3 text-2xl float-1" style={{ animationDelay: '2s' }}>🏠</div>
      <div className="floating-shape bottom-60 right-1/4 text-3xl float-2" style={{ animationDelay: '3s' }}>🩺</div>
      <div className="floating-shape top-96 right-10 text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape bottom-20 left-1/2 text-2xl float-1" style={{ animationDelay: '4s' }}>🐕</div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 fredoka text-foreground leading-tight">
            Find the Perfect Match for Your Pet
          </h1>
          
          {/* New Tagline Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-2">
              What are you looking for?
            </h2>
            <p className="text-lg md:text-xl font-medium text-accent fredoka">
              "PetMatch" - Got everything you need for your pet! 🐾
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with pet owners for breeding, find trusted pet sitters, and access veterinary services - all in one platform designed for pet lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="btn-gradient text-lg px-8 py-4 rounded-lg"
              onClick={() => navigate('/breeding')}
            >
              Start Matching
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 rounded-lg border-2 hover:bg-muted/50 subtle-elevation"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>

          {/* Feature Pills - Smaller and closer */}
          <div className="flex flex-wrap justify-center gap-3">
            <div 
              className="flex items-center bg-card rounded-lg px-4 py-2 subtle-elevation border border-border cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/breeding')}
            >
              <div className="w-6 h-6 gradient-warm rounded-lg flex items-center justify-center mr-2">
                <Heart className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium text-foreground text-sm">Pet Breeding</span>
            </div>
            <div 
              className="flex items-center bg-card rounded-lg px-4 py-2 subtle-elevation border border-border cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/pet-sitting')}
            >
              <div className="w-6 h-6 gradient-love rounded-lg flex items-center justify-center mr-2">
                <Users className="w-3 h-3 text-foreground" />
              </div>
              <span className="font-medium text-foreground text-sm">Pet Sitting</span>
            </div>
            <div 
              className="flex items-center bg-card rounded-lg px-4 py-2 subtle-elevation border border-border cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/veterinary')}
            >
              <div className="w-6 h-6 gradient-warm rounded-lg flex items-center justify-center mr-2">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium text-foreground text-sm">Vet Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
