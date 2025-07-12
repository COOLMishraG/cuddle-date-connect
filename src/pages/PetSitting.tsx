
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Users, Star, Calendar, MapPin, Shield, Heart, Clock, CheckCircle, Filter, Search, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import BookSitting from '@/components/BookSitting';
import { userApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user';

const PetSitting = () => {
  const { currentUser } = useAuth();
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedSitter, setSelectedSitter] = useState<{ id: string; name: string } | null>(null);
  const [sitters, setSitters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Template for users with missing details
  const sitterTemplate = {
    experience: '2+ years',
    rating: 4.5,
    reviewCount: 25,
    price: '$30/day',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&auto=format',
    available: true,
    verified: true,
    specialties: ['Dogs', 'Cats'],
    description: 'Experienced pet sitter dedicated to providing loving care for your furry friends.',
    responseTime: '2 hours',
    petsSatCount: 50
  };

  useEffect(() => {
    const fetchSitters = async () => {
      try {
        setLoading(true);
        const allSitters = await userApi.getAllSitters();
        
        // Filter out the current user and transform the data
        const filteredSitters = allSitters
          .filter(sitter => sitter.username !== currentUser?.username)
          .map(sitter => ({
            // Fields from User entity
            id: sitter.id,
            name: sitter.name || sitter.displayName || sitter.username,
            location: sitter.location || 'Location not specified',
            image: sitter.profileImage || sitterTemplate.image,
            verified: sitter.isVerified || false, // Use isVerified from User entity
            username: sitter.username,
            email: sitter.email,
            phone: sitter.phone,
            
            // Fields from template (not in User entity)
            experience: sitterTemplate.experience,
            rating: sitterTemplate.rating,
            reviewCount: sitterTemplate.reviewCount,
            price: sitterTemplate.price,
            available: sitterTemplate.available,
            specialties: sitterTemplate.specialties,
            description: sitterTemplate.description,
            responseTime: sitterTemplate.responseTime,
            petsSatCount: sitterTemplate.petsSatCount
          }));
        
        setSitters(filteredSitters);
      } catch (error) {
        console.error('Error fetching sitters:', error);
        setError('Failed to load sitters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSitters();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-800">
              <Heart className="w-4 h-4 mr-2" />
              Trusted Pet Sitting
            </Badge>
            
            <h1 className="text-display-1 font-display text-slate-800 mb-6">
              Find the Perfect
              <span className="text-gradient-primary block">Pet Sitter Near You</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Connect with verified, loving pet sitters in your area. Your pets deserve 
              the best care while you're away, and we're here to make that happen.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Enter your location..." 
                    className="h-12 text-lg border-slate-200 focus:border-indigo-300"
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="Select dates..." 
                    className="h-12 text-lg border-slate-200 focus:border-indigo-300"
                  />
                </div>
                <Button className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Available Pet Sitters</h2>
              <p className="text-slate-600">
                {loading 
                  ? 'Loading sitters...' 
                  : `${sitters.filter(s => s.available).length} sitters available in your area`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <select className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white">
                <option>Sort by Rating</option>
                <option>Sort by Price</option>
                <option>Sort by Distance</option>
              </select>
            </div>
          </div>

          {/* Sitters Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading sitters...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : sitters.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No sitters available</h3>
              <p className="text-gray-500">Check back later for new sitters in your area!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sitters.map((sitter) => (
              <Card key={sitter.id} className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${!sitter.available ? 'opacity-60' : ''}`}>
                <div className="relative">
                  <img 
                    src={sitter.image} 
                    alt={sitter.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {sitter.verified && (
                      <Badge className="bg-emerald-500 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant={sitter.available ? "default" : "secondary"} className={sitter.available ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                      {sitter.available ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 font-bold text-slate-800 shadow-lg">
                    {sitter.price}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">{sitter.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {sitter.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Users className="w-3 h-3 mr-1" />
                        {sitter.experience} experience
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-slate-700 ml-1">{sitter.rating}</span>
                      <span className="text-sm text-slate-500 ml-1">({sitter.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{sitter.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sitter.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Responds in {sitter.responseTime}
                    </div>
                    <div>{sitter.petsSatCount}+ pets cared for</div>
                  </div>
                  
                  <Button 
                    className={`w-full ${sitter.available 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!sitter.available}
                    onClick={() => {
                      if (sitter.available) {
                        setSelectedSitter({ id: sitter.id, name: sitter.name });
                        setShowBookForm(true);
                      }
                    }}
                  >
                    {sitter.available ? 'Book Now' : 'Unavailable'}
                  </Button>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display-2 font-display text-slate-800 mb-4">
              Your Pet's Safety is Our
              <span className="text-gradient-primary block">Top Priority</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every sitter on our platform is thoroughly vetted and verified to ensure 
              your pet receives the highest quality care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Background Verified</h3>
              <p className="text-slate-600">Comprehensive background checks and identity verification for all sitters.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Insurance Protected</h3>
              <p className="text-slate-600">Full insurance coverage for every booking to protect you and your pet.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">24/7 Support</h3>
              <p className="text-slate-600">Round-the-clock customer support and emergency assistance when you need it.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Booking Dialog */}
      <BookSitting
        open={showBookForm}
        onClose={() => {
          setShowBookForm(false);
          setSelectedSitter(null);
        }}
        sitterId={selectedSitter?.id}
        sitterName={selectedSitter?.name}
      />
    </div>
  );
};

export default PetSitting;
