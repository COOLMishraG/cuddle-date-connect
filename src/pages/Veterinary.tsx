import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Calendar, MapPin, Star, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ScheduleVet from '@/components/ScheduleVet';
import { vetApi } from '@/services/api';
import { User, UserRole } from '@/types/user';
import { toast } from '@/components/ui/use-toast';

const Veterinary = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedVet, setSelectedVet] = useState<User | null>(null);
  // const [vets, setVets] = useState<User[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // Sample data for veterinarians
  const vets: User[] = [
    {
      id: '1',
      name: 'Dr. Evelyn Reed',
      email: 'evelyn.reed@vet.com',
      username: 'evelynreed',
      profileImage: 'https://i.pravatar.cc/300?u=vet1',
      role: UserRole.VET,
      specialty: 'Cardiology',
      experience: '12 years',
      location: 'New York, NY',
      rating: 4.9,
      verified: true,
      available: true,
    },
    {
      id: '2',
      name: 'Dr. Samuel Chen',
      email: 'samuel.chen@vet.com',
      username: 'samuelchen',
      profileImage: 'https://i.pravatar.cc/300?u=vet2',
      role: UserRole.VET,
      specialty: 'Orthopedics',
      experience: '8 years',
      location: 'San Francisco, CA',
      rating: 4.8,
      verified: true,
      available: false,
    },
    {
      id: '3',
      name: 'Dr. Olivia Martinez',
      email: 'olivia.martinez@vet.com',
      username: 'oliviamartinez',
      profileImage: 'https://i.pravatar.cc/300?u=vet3',
      role: UserRole.VET,
      specialty: 'Dermatology',
      experience: '15 years',
      location: 'Miami, FL',
      rating: 4.9,
      verified: true,
      available: true,
    },
     {
      id: '4',
      name: 'Dr. Benjamin Carter',
      email: 'ben.carter@vet.com',
      username: 'bencarter',
      profileImage: 'https://i.pravatar.cc/300?u=vet4',
      role: UserRole.VET,
      specialty: 'Neurology',
      experience: '10 years',
      location: 'Chicago, IL',
      rating: 4.7,
      verified: false,
      available: true,
    },
    {
      id: '5',
      name: 'Dr. Chloe Nguyen',
      email: 'chloe.nguyen@vet.com',
      username: 'chloenguyen',
      profileImage: 'https://i.pravatar.cc/300?u=vet5',
      role: UserRole.VET,
      specialty: 'Oncology',
      experience: '9 years',
      location: 'Seattle, WA',
      rating: 4.8,
      verified: true,
      available: false,
    },
    {
      id: '6',
      name: 'Dr. Marcus Rodriguez',
      email: 'marcus.r@vet.com',
      username: 'marcusr',
      profileImage: 'https://i.pravatar.cc/300?u=vet6',
      role: UserRole.VET,
      specialty: 'General Surgery',
      experience: '18 years',
      location: 'Houston, TX',
      rating: 5.0,
      verified: true,
      available: true,
    },
  ];

  /*
  useEffect(() => {
    const fetchVets = async () => {
      try {
        setIsLoading(true);
        const fetchedVets = await vetApi.getAllVets();
        setVets(fetchedVets);
      } catch (error) {
        console.error("Failed to fetch veterinarians:", error);
        toast({
          title: "Error fetching vets",
          description: "Could not load the list of veterinarians. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVets();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Heart size={40} className="text-burgundy mx-auto" />
          </div>
          <p className="mt-4 text-deep-rose">Loading veterinarians...</p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Veterinary Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with certified veterinarians and emergency services for your beloved pets
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="outline" 
              className="glass-card border-0 bg-white/20 hover:bg-white/30 text-gray-700 px-8 py-3 h-auto"
              onClick={() => {
                setIsEmergency(false);
                setSelectedVet(null);
                setShowScheduleForm(true);
              }}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
            <Button 
              className="premium-gradient text-white px-8 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                setIsEmergency(true);
                setSelectedVet(null);
                setShowScheduleForm(true);
              }}
            >
              Emergency Services 🚨
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Veterinarians</h2>
          <p className="text-gray-600">Expert care from licensed professionals</p>
        </div>        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vets.map((vet) => (
            <Card key={vet.id} className="glass-card border-0 bg-white/40 backdrop-blur-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img 
                  src={`https://images.unsplash.com/photo-${vet.id === '1' ? '1612349317150-e413d8ba47a8' : vet.id === '2' ? '1582750433449-648ed127bb54' : vet.id === '3' ? '1594824309503-98485fa80d31' : vet.id === '4' ? '1612349307596-71920d83b1b3' : vet.id === '5' ? '1559839734-2b71ea197ec2' : '1582467420946-94b8bba9c76a'}?w=400&h=300&fit=crop&auto=format`} 
                  alt={vet.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                {vet.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                  vet.available 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-red-500/90 text-white'
                }`}>
                  {vet.available ? '🟢 Available' : '🔴 Busy'}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{vet.name}</h3>
                  <p className="text-blue-600 font-medium">{vet.specialty || 'General Practice'}</p>
                  <p className="text-sm text-gray-600">{vet.experience || '5'} years experience</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {vet.location || 'Not specified'}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">{vet.rating || 'N/A'}</span>
                    <span className="text-xs text-gray-500 ml-1">(120+ reviews)</span>
                  </div>
                </div>
                
                <Button 
                  className={`w-full transition-all duration-300 ${
                    vet.available 
                      ? 'premium-gradient text-white hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!vet.available}
                  onClick={() => {
                    setSelectedVet(vet);
                    setIsEmergency(false);
                    setShowScheduleForm(true);
                  }}
                >
                  {vet.available ? 'Schedule Appointment' : 'Currently Unavailable'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust & Safety Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Veterinarians?</h2>
            <p className="text-gray-600">Your pet's health and safety is our top priority</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Licensed & Verified</h3>
              <p className="text-gray-600">All veterinarians are licensed professionals with verified credentials</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Compassionate Care</h3>
              <p className="text-gray-600">Our vets provide loving, gentle care for your beloved pets</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Emergency</h3>
              <p className="text-gray-600">Emergency services available around the clock for urgent care</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Schedule Appointment Dialog */}
      <ScheduleVet
        open={showScheduleForm}
        onClose={() => {
          setShowScheduleForm(false);
          setIsEmergency(false);
        }}
        vetId={selectedVet?.id}
        vetName={selectedVet?.name}
        isEmergency={isEmergency}
      />
    </div>
  );
};

export default Veterinary;
