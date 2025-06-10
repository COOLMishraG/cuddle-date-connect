
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
      features: ['Smart matching algorithm', 'Verified pet profiles', 'Health certificates', 'Direct messaging']
    },
    {
      icon: Users,
      title: 'Pet Sitting',
      description: 'Find trusted pet sitters in your area when you need to travel. Professional caregivers who love pets as much as you do.',
      gradient: 'gradient-teal',
      features: ['Background-checked sitters', 'Real-time updates', 'Emergency contact', 'Flexible scheduling']
    },
    {
      icon: Calendar,
      title: 'Veterinary Services',
      description: 'Book appointments with certified veterinarians. From routine checkups to emergency care, find the right vet for your pet.',
      gradient: 'gradient-purple',
      features: ['Online consultations', 'Emergency services', 'Vaccination tracking', 'Health records']
    },
    {
      icon: MessageSquare,
      title: 'Community',
      description: 'Connect with fellow pet owners, share experiences, and build lasting friendships within our caring community.',
      gradient: 'gradient-coral',
      features: ['Pet owner forums', 'Local meetups', 'Photo sharing', 'Expert advice']
    }
  ];

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Everything Your Pet Needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive services designed to make pet ownership easier, safer, and more enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden shadow-lg card-hover border-0">
              <div className={`h-2 ${service.gradient}`}></div>
              <CardContent className="p-8">
                <div className={`w-16 h-16 ${service.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full btn-gradient">
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
