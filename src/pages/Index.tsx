
import Header from '../components/Header';
import MatchDeckCards from '../components/MatchDeckCards';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Shield, 
  Calendar, 
  Star, 
  ArrowRight, 
  Play, 
  CheckCircle,
  PawPrint,
  Clock,
  MapPin,
  Award,
  Smartphone,
  Video,
  MessageCircle,
  Zap,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchApi } from '@/services/api';

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [matchRequests, setMatchRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch match requests for authenticated users
  useEffect(() => {
    const fetchMatchRequests = async () => {
      if (isAuthenticated && currentUser) {
        try {
          setLoadingRequests(true);
          const requests = await matchApi.getReceivedMatchRequests(currentUser.id);
          setMatchRequests(requests);
        } catch (error) {
          console.error('Error fetching match requests:', error);
        } finally {
          setLoadingRequests(false);
        }
      }
    };

    fetchMatchRequests();
  }, [isAuthenticated, currentUser]);

  const handleRequestStatusChange = async () => {
    // Refresh the match requests after status change
    if (isAuthenticated && currentUser) {
      try {
        const requests = await matchApi.getReceivedMatchRequests(currentUser.id);
        setMatchRequests(requests);
      } catch (error) {
        console.error('Error refreshing match requests:', error);
      }
    }
  };

  const stats = [
    { 
      number: '50K+', 
      label: 'Active Users',
      icon: Users,
      color: 'text-indigo-600'
    },
    { 
      number: '15K+', 
      label: 'Verified Sitters',
      icon: Shield,
      color: 'text-emerald-600'
    },
    { 
      number: '1K+', 
      label: 'Expert Vets',
      icon: Heart,
      color: 'text-pink-600'
    },
    { 
      number: '100+', 
      label: 'Cities',
      icon: Globe,
      color: 'text-blue-600'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Trust & Safety First',
      description: 'Every caregiver undergoes thorough background checks, insurance verification, and skill assessments.',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get live photos, videos, and GPS tracking of your pet\'s activities throughout the day.',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      iconColor: 'text-blue-600'
    },
    {
      icon: Award,
      title: 'Premium Care Quality',
      description: 'Our caregivers are rated 4.9/5 stars and receive ongoing training in pet care excellence.',
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      iconColor: 'text-purple-600'
    },
    {
      icon: Smartphone,
      title: 'Smart Booking System',
      description: 'AI-powered matching connects you with the perfect caregiver based on your pet\'s unique needs.',
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      iconColor: 'text-orange-600'
    }
  ];

  const services = [
    {
      title: 'Pet Sitting & Boarding',
      description: 'Professional in-home pet sitting or boarding with experienced, loving caregivers.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=400&fit=crop&auto=format',
      price: 'Starting at $25/day',
      features: ['24/7 Care', 'Daily Updates', 'Emergency Support'],
      link: '/pet-sitting',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Veterinary Services',
      description: 'Connect with certified veterinarians for routine care, emergencies, and specialized treatments.',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=400&fit=crop&auto=format',
      price: 'Starting at $75/visit',
      features: ['Licensed Vets', 'House Calls', 'Emergency Care'],
      link: '/veterinary',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Pet Community',
      description: 'Join a vibrant community of pet lovers, share experiences, and find local pet events.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=400&fit=crop&auto=format',
      price: 'Free to join',
      features: ['Local Events', 'Expert Advice', 'Social Network'],
      link: '/community',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Dog Owner',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format',
      text: 'CuddleDateConnect transformed how I care for my rescue dog. The real-time updates and professional sitters give me complete peace of mind.',
      rating: 5,
      location: 'San Francisco, CA'
    },
    {
      name: 'Marcus Johnson',
      role: 'Cat Parent',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format',
      text: 'The emergency vet service literally saved my cat\'s life at 2AM. The response time and care quality exceeded all expectations.',
      rating: 5,
      location: 'Austin, TX'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Pet Sitter',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format',
      text: 'As a professional sitter, this platform connects me with amazing pet families. The tools and support are exceptional.',
      rating: 5,
      location: 'Miami, FL'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                  <Zap className="w-4 h-4 mr-2" />
                  Trusted by 50,000+ Pet Families
                </Badge>
                
                <h1 className="text-display-1 font-display text-slate-800 leading-tight">
                  Premium Pet Care
                  <span className="text-gradient-brand block"> That Feels Like Family</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Connect with verified pet sitters, licensed veterinarians, and a community of pet lovers. 
                  Your furry family deserves nothing but the best care, love, and attention.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link to="/signin">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-700 px-8 py-4 text-lg font-semibold bg-white/50 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="flex flex-col items-center space-y-2">
                      <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} />
                      <div className="text-2xl lg:text-3xl font-bold text-slate-800">{stat.number}</div>
                      <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image - Always visible */}
            <div className="relative animate-slide-in-right">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&h=700&fit=crop&auto=format"
                  alt="Beautiful Golden Retriever - Your perfect pet companion"
                  className="rounded-3xl shadow-2xl w-full object-cover"
                />
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-pulse-gentle">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Live Updates</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-slate-700">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute -top-8 -right-8 w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl -z-10 opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
              Why Choose Us
            </Badge>
            <h2 className="text-display-2 font-display text-slate-800 mb-6">
              Experience the Future of
              <span className="text-gradient-primary block">Pet Care</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We've revolutionized pet care with cutting-edge technology, rigorous safety standards, 
              and a community-first approach that puts your pet's happiness first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-90"></div>
                <CardContent className="relative p-8 text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gradient-to-br from-slate-100 to-slate-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
              Our Services
            </Badge>
            <h2 className="text-display-2 font-display text-slate-800 mb-6">
              Comprehensive Care for
              <span className="text-gradient-secondary block">Every Pet Need</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From daily walks to emergency veterinary care, we provide end-to-end solutions 
              for all your pet's needs with premium quality and unmatched convenience.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`bg-white text-slate-800 font-semibold px-3 py-1`}>
                      {service.price}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild 
                    className={`w-full bg-gradient-to-r ${service.gradient} text-white font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    <Link to={service.link}>
                      Explore Service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Playful Pets Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-white/50 backdrop-blur-sm">
                  🎾 Playtime & Fun
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                  Every Pet Deserves
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Endless Joy & Play
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed mb-8">
                  Watch your furry friends thrive in our safe, supervised play environments. 
                  From fetch sessions to agility courses, we make every day an adventure!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">500+</div>
                  <div className="text-sm text-slate-600">Daily Playtimes</div>
                </div>
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">Fun Activities</div>
                </div>
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-pink-600 mb-1">100%</div>
                  <div className="text-sm text-slate-600">Happy Tails</div>
                </div>
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">50+</div>
                  <div className="text-sm text-slate-600">Play Areas</div>
                </div>
              </div>

              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/community">
                  Join the Fun Community <PawPrint className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Right Playful Image */}
            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=600&h=600&fit=crop&auto=format"
                  alt="Happy dogs playing together in the park"
                  className="rounded-3xl shadow-2xl w-full object-cover"
                />
                
                {/* Floating Play Elements */}
                <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl animate-bounce">
                  <span className="text-2xl">🎾</span>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl animate-pulse">
                  <span className="text-2xl">🐕</span>
                </div>
                
                <div className="absolute top-1/2 -right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-xl animate-pulse">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -inset-8 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-3xl -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
              Testimonials
            </Badge>
            <h2 className="text-display-2 font-display text-slate-800 mb-6">
              Loved by Pet Families
              <span className="text-gradient-brand block">Across the Country</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what thousands of pet families 
              and professional caregivers say about their CuddleDateConnect experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-700 mb-8 text-lg leading-relaxed italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover ring-4 ring-slate-100"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-slate-500 font-medium">{testimonial.role}</div>
                      <div className="text-xs text-slate-400 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-8 px-6 py-3 text-base font-semibold bg-white/20 text-white border-white/30">
            <TrendingUp className="w-5 h-5 mr-2" />
            Join 50,000+ Happy Pet Families
          </Badge>
          
          <h2 className="text-display-1 font-display mb-8 leading-tight">
            Ready to Transform Your
            <span className="block text-yellow-300">Pet Care Experience?</span>
          </h2>
          
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Join the largest community of pet lovers and give your furry family members 
            the premium care they deserve. Get started today with our free membership and 
            discover why thousands trust us with their most precious companions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-10 py-5 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              asChild
            >
              <Link to="/signin">
                Start Free Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-10 py-5 text-lg font-bold bg-transparent backdrop-blur-sm"
            >
              <Video className="mr-3 h-6 w-6" />
              Schedule Demo Call
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 mb-3 text-emerald-300" />
              <span className="font-semibold">Free to Join</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 mb-3 text-blue-300" />
              <span className="font-semibold">Verified Caregivers</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="h-8 w-8 mb-3 text-pink-300" />
              <span className="font-semibold">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 mb-3 text-yellow-300" />
              <span className="font-semibold">Instant Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <PawPrint className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient-brand">
                  CuddleDateConnect
                </span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed max-w-md">
                The premier platform connecting pet families with verified caregivers, 
                licensed veterinarians, and a loving community of pet enthusiasts.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                <li><Link to="/pet-sitting" className="text-slate-400 hover:text-white transition-colors font-medium">Pet Sitting</Link></li>
                <li><Link to="/veterinary" className="text-slate-400 hover:text-white transition-colors font-medium">Veterinary Care</Link></li>
                <li><Link to="/community" className="text-slate-400 hover:text-white transition-colors font-medium">Pet Community</Link></li>
                <li><Link to="/breeding" className="text-slate-400 hover:text-white transition-colors font-medium">Pet Breeding</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors font-medium">About Us</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Press Kit</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Contact</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/signin" className="text-slate-400 hover:text-white transition-colors font-medium">Sign In</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Safety</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-center md:text-left">
              &copy; 2025 CuddleDateConnect. All rights reserved. Made with ❤️ for pet lovers everywhere.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Match Deck Cards Overlay */}
      {isAuthenticated && matchRequests.length > 0 && !loadingRequests && (
        <MatchDeckCards 
          matchRequests={matchRequests}
          onStatusChange={handleRequestStatusChange}
        />
      )}
    </div>
  );
};

export default Index;
