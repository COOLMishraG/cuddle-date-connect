
import { Heart, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 gradient-coral rounded-full opacity-20 float-animation"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 gradient-teal rounded-full opacity-30 float-animation" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Find the Perfect Match for Your Pet
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with pet owners for breeding, find trusted pet sitters, and access veterinary services - all in one platform designed for pet lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="btn-gradient text-lg px-8 py-4">
              Start Matching
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-muted">
              Learn More
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <Heart className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium">Pet Breeding</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <Users className="w-5 h-5 text-accent mr-2" />
              <span className="font-medium">Pet Sitting</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
              <Calendar className="w-5 h-5 text-teal-500 mr-2" />
              <span className="font-medium">Vet Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
