
import { Heart, Users, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServicesSection = () => {
  const services = [
    {
      icon: Heart,
      title: 'Pet Breeding',
      description: 'Find the perfect breeding partner for your pet. Browse profiles, match with compatible pets, and connect with responsible owners.',
      gradient: 'gradient-coral',
      bgPattern: 'from-rose-50 to-pink-50',
      features: ['Smart matching algorithm', 'Verified pet profiles', 'Health certificates', 'Direct messaging'],
      delay: '0s'
    },
    {
      icon: Users,
      title: 'Pet Sitting',
      description: 'Find trusted pet sitters in your area when you need to travel. Professional caregivers who love pets as much as you do.',
      gradient: 'gradient-teal',
      bgPattern: 'from-cyan-50 to-blue-50',
      features: ['Background-checked sitters', 'Real-time updates', 'Emergency contact', 'Flexible scheduling'],
      delay: '0.1s'
    },
    {
      icon: Calendar,
      title: 'Veterinary Services',
      description: 'Book appointments with certified veterinarians. From routine checkups to emergency care, find the right vet for your pet.',
      gradient: 'gradient-purple',
      bgPattern: 'from-purple-50 to-indigo-50',
      features: ['Online consultations', 'Emergency services', 'Vaccination tracking', 'Health records'],
      delay: '0.2s'
    },
    {
      icon: MessageSquare,
      title: 'Community',
      description: 'Connect with fellow pet owners, share experiences, and build lasting friendships within our caring community.',
      gradient: 'gradient-mint',
      bgPattern: 'from-emerald-50 to-green-50',
      features: ['Pet owner forums', 'Local meetups', 'Photo sharing', 'Expert advice'],
      delay: '0.3s'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Everything Your Pet Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive services designed to make pet ownership easier, safer, and more enjoyable for you and your furry friends.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden shadow-xl card-hover border-0 bg-gradient-to-br ${service.bgPattern} card-reveal`}
              style={{ animationDelay: service.delay }}
            >
              {/* Decorative top border */}
              <div className={`h-1 ${service.gradient}`}></div>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className={`w-full h-full ${service.gradient} rounded-full blur-2xl`}></div>
              </div>
              
              <CardContent className="p-10 relative">
                <div className={`w-20 h-20 ${service.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-lg pulse-glow`}>
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold mb-6 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-4 mb-10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-base">
                      <div className={`w-3 h-3 ${service.gradient} rounded-full mr-4 shadow-sm`}></div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full btn-gradient text-lg py-4 rounded-xl shadow-lg">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
