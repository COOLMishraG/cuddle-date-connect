
import { Heart, Users, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Heart,
      title: 'Pet Breeding',
      description: 'Find the perfect breeding partner for your pet. Browse profiles, match with compatible pets, and connect with responsible owners.',
      gradient: 'gradient-warm',
      features: ['Smart matching algorithm', 'Verified pet profiles', 'Health certificates', 'Direct messaging'],
      delay: '0s',
      path: '/breeding'
    },
    {
      icon: Users,
      title: 'Pet Sitting',
      description: 'Find trusted pet sitters in your area when you need to travel. Professional caregivers who love pets as much as you do.',
      gradient: 'gradient-love',
      features: ['Background-checked sitters', 'Real-time updates', 'Emergency contact', 'Flexible scheduling'],
      delay: '0.1s',
      path: '/pet-sitting'
    },
    {
      icon: Calendar,
      title: 'Veterinary Services',
      description: 'Book appointments with certified veterinarians. From routine checkups to emergency care, find the right vet for your pet.',
      gradient: 'gradient-warm',
      features: ['Online consultations', 'Emergency services', 'Vaccination tracking', 'Health records'],
      delay: '0.2s',
      path: '/veterinary'
    },
    {
      icon: MessageSquare,
      title: 'Community',
      description: 'Connect with fellow pet owners, share experiences, and build lasting friendships within our caring community.',
      gradient: 'gradient-love',
      features: ['Pet owner forums', 'Local meetups', 'Photo sharing', 'Expert advice'],
      delay: '0.3s',
      path: '/community'
    }
  ];

  return (
    <section id="services" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 fredoka text-foreground">
            Everything Your Pet Needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive services designed to make pet ownership easier, safer, and more enjoyable for you and your furry friends.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden subtle-elevation border bg-card fade-up cursor-pointer hover:scale-105 transition-transform"
              style={{ animationDelay: service.delay }}
              onClick={() => navigate(service.path)}
            >
              {/* Simple top accent */}
              <div className={`h-1 ${service.gradient}`}></div>
              
              <CardContent className="p-6 relative">
                <div className={`w-12 h-12 ${service.gradient} rounded-lg flex items-center justify-center mb-4 soft-glow`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground fredoka">{service.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs">
                      <div className={`w-1.5 h-1.5 ${service.gradient} rounded-full mr-2`}></div>
                      <span className="font-medium text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full btn-gradient py-2 rounded-lg text-sm">
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
