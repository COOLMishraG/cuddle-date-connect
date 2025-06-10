
import { Heart, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-background"></div>
      <div className="absolute top-32 left-20 w-32 h-32 gradient-coral rounded-full opacity-8 gentle-float blur-2xl"></div>
      <div className="absolute bottom-40 right-20 w-24 h-24 gradient-teal rounded-full opacity-10 gentle-float blur-xl" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Find the Perfect Match for Your Pet
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with pet owners for breeding, find trusted pet sitters, and access veterinary services - all in one platform designed for pet lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button className="btn-gradient text-lg px-10 py-5 rounded-lg">
              Start Matching
            </Button>
            <Button variant="outline" className="text-lg px-10 py-5 rounded-lg border-2 hover:bg-muted/50 subtle-elevation">
              Learn More
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center bg-card rounded-lg px-6 py-3 subtle-elevation border border-border">
              <div className="w-8 h-8 gradient-coral rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-foreground">Pet Breeding</span>
            </div>
            <div className="flex items-center bg-card rounded-lg px-6 py-3 subtle-elevation border border-border">
              <div className="w-8 h-8 gradient-teal rounded-lg flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-foreground">Pet Sitting</span>
            </div>
            <div className="flex items-center bg-card rounded-lg px-6 py-3 subtle-elevation border border-border">
              <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-foreground">Vet Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
