
import Header from '@/components/Header';
import { Heart, Users, Calendar, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: Heart,
      title: 'Pet Matchmaking',
      description: 'Advanced algorithm to find perfect breeding partners based on breed, temperament, and health records.'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Verified pet owners, sitters, and veterinarians creating a safe environment for all pets.'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Simple scheduling system for pet sitting services and veterinary appointments.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your pet\'s information and your privacy are protected with industry-standard security.'
    }
  ];
  return (
    <div className="min-h-screen bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="floating-shape absolute top-[12%] left-[10%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[8%] right-[18%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[22%] left-[14%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[40%] left-[22%] text-2xl float-1" style={{ animationDelay: '2s' }}>🦮</div>
      <div className="floating-shape absolute bottom-[33%] right-[20%] text-3xl float-2" style={{ animationDelay: '3s' }}>🐈</div>
      <div className="floating-shape absolute top-[55%] right-[12%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[8%] left-[40%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐶</div>

      <Header />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">About PetMatch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're passionate about connecting pet owners and creating a comprehensive platform 
            for all your pet care needs. From finding breeding partners to trusted sitters and 
            veterinary services, we've got everything covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 gradient-warm rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl fredoka mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold fredoka mb-4">Our Mission</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            To create a world where every pet receives the love, care, and attention they deserve. 
            We believe that by connecting passionate pet owners, professional caregivers, and 
            qualified veterinarians, we can make pet ownership more enjoyable, safer, and more 
            fulfilling for everyone involved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
