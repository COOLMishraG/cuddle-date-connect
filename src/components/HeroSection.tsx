
import { Heart, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-accent/3"></div>
      <div className="absolute top-20 left-20 w-40 h-40 gradient-teal rounded-full opacity-10 float-animation blur-xl"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 gradient-purple rounded-full opacity-15 float-animation blur-lg" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 gradient-mint rounded-full opacity-20 float-animation blur-md" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Find the Perfect Match for Your Pet
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with pet owners for breeding, find trusted pet sitters, and access veterinary services - all in one platform designed for pet lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button className="btn-gradient text-xl px-12 py-6 rounded-2xl shadow-xl">
              Start Matching
            </Button>
            <Button variant="outline" className="text-xl px-12 py-6 rounded-2xl border-2 hover:bg-muted glass-effect">
              Learn More
            </Button>
          </div>

          {/* Enhanced Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center glass-effect rounded-2xl px-8 py-4 shadow-lg card-hover">
              <div className="w-10 h-10 gradient-coral rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Pet Breeding</span>
            </div>
            <div className="flex items-center glass-effect rounded-2xl px-8 py-4 shadow-lg card-hover">
              <div className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Pet Sitting</span>
            </div>
            <div className="flex items-center glass-effect rounded-2xl px-8 py-4 shadow-lg card-hover">
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Vet Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
