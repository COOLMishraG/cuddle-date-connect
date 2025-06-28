
import Header from '../components/Header';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About PetMatch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're passionate about connecting pet owners and creating a comprehensive platform 
            for all your pet care needs. From finding breeding partners to trusted sitters and 
            veterinary services, we've got everything covered.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2">
              <span className="text-indigo-600 font-medium">🐾 50,000+ Happy Pets</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2">
              <span className="text-purple-600 font-medium">👨‍⚕️ 500+ Verified Vets</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2">
              <span className="text-blue-600 font-medium">⭐ 4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 relative z-10">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose PetMatch?</h2>
          <p className="text-gray-600">Discover what makes us the premier pet care platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-0 bg-white/40 backdrop-blur-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="text-center">
          <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                To create a world where every pet receives the love, care, and attention they deserve by connecting passionate pet owners with trusted professionals and building meaningful relationships within the pet community.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2019</div>
                  <div>Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">50K+</div>
                  <div>Happy Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">25K+</div>
                  <div>Pet Parents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">500+</div>
                  <div>Professionals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
