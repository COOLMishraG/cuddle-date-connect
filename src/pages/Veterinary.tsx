
import { useState } from 'react';
import Header from '@/components/Header';
import { Calendar, MapPin, Star, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ScheduleVet from '@/components/ScheduleVet';

const Veterinary = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedVet, setSelectedVet] = useState<{ id: string; name: string } | null>(null);
  
  const vets = [
    {
      id: '1',
      name: 'Dr. Sarah Williams',
      specialty: 'General Practice',
      location: 'San Francisco, CA',
      rating: 4.9,
      experience: '10 years',
      image: '/placeholder.svg',
      verified: true,
      available: true
    },
    {
      id: '2',
      name: 'Dr. Michael Brown',
      specialty: 'Emergency Care',
      location: 'Los Angeles, CA',
      rating: 4.8,
      experience: '8 years',
      image: '/placeholder.svg',
      verified: true,
      available: false
    }
  ];
  return (
    <div className="min-h-screen bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes - Enhanced with more emojis */}
      <div className="floating-shape absolute top-[5%] left-[5%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[10%] right-[8%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[20%] left-[7%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[25%] left-[33%] text-2xl float-1" style={{ animationDelay: '2s' }}>🏠</div>
      <div className="floating-shape absolute bottom-[25%] right-[25%] text-3xl float-2" style={{ animationDelay: '3s' }}>🩺</div>
      <div className="floating-shape absolute top-[40%] right-[5%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[10%] left-[50%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐈</div>

      {/* Additional floating emojis for veterinary page */}
      <div className="floating-shape absolute top-[15%] left-[70%] text-3xl float-2" style={{ animationDelay: '1.5s' }}>🐱</div>
      <div className="floating-shape absolute top-[60%] left-[15%] text-2xl float-3" style={{ animationDelay: '2.5s' }}>💊</div>
      <div className="floating-shape absolute bottom-[35%] left-[80%] text-4xl float-1" style={{ animationDelay: '3.5s' }}>🏥</div>
      <div className="floating-shape absolute top-[75%] right-[40%] text-3xl float-2" style={{ animationDelay: '0.5s' }}>🐕‍🦺</div>
      <div className="floating-shape absolute top-[30%] left-[60%] text-2xl float-3" style={{ animationDelay: '4.5s' }}>🩹</div>
      <div className="floating-shape absolute bottom-[55%] right-[15%] text-5xl float-1" style={{ animationDelay: '1.8s' }}>💙</div>
      <div className="floating-shape absolute top-[85%] left-[25%] text-3xl float-2" style={{ animationDelay: '3.2s' }}>🦴</div>
      <div className="floating-shape absolute bottom-[5%] right-[60%] text-2xl float-3" style={{ animationDelay: '2.8s' }}>💉</div>
      <div className="floating-shape absolute top-[20%] left-[45%] text-4xl float-1" style={{ animationDelay: '4.2s' }}>🚑</div>
      <div className="floating-shape absolute bottom-[40%] left-[28%] text-3xl float-2" style={{ animationDelay: '0.8s' }}>🔬</div>
      <div className="floating-shape absolute top-[55%] right-[30%] text-2xl float-3" style={{ animationDelay: '3.8s' }}>🩼</div>
      <div className="floating-shape absolute bottom-[50%] left-[55%] text-4xl float-1" style={{ animationDelay: '1.2s' }}>🌟</div>
      <div className="floating-shape absolute top-[70%] left-[75%] text-3xl float-2" style={{ animationDelay: '4.8s' }}>🦊</div>
      <div className="floating-shape absolute top-[8%] left-[25%] text-2xl float-3" style={{ animationDelay: '2.2s' }}>🐰</div>
      <div className="floating-shape absolute bottom-[15%] right-[10%] text-4xl float-1" style={{ animationDelay: '3.7s' }}>🏆</div>

      <Header />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Veterinary Services</h1>
          <p className="text-muted-foreground">Connect with certified veterinarians in your area</p>
        </div>        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              setIsEmergency(false);
              setSelectedVet(null);
              setShowScheduleForm(true);
            }}
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Button>
          <Button 
            className="btn-gradient"
            onClick={() => {
              setIsEmergency(true);
              setSelectedVet(null);
              setShowScheduleForm(true);
            }}
          >
            Emergency Services
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <Card key={vet.id} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <div className="h-48 bg-gray-200">
                <img src={vet.image} alt={vet.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg fredoka">{vet.name}</h3>
                  {vet.verified && (
                    <Shield className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{vet.specialty}</p>
                <p className="text-xs text-muted-foreground">{vet.experience} experience</p>
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {vet.location}
                </div>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{vet.rating}</span>
                </div>
                <div className="flex justify-between items-center mt-4">                  <span className={`text-xs px-2 py-1 rounded ${vet.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {vet.available ? 'Available' : 'Busy'}
                  </span>
                  <Button 
                    size="sm" 
                    className="btn-gradient" 
                    disabled={!vet.available}
                    onClick={() => {
                      setSelectedVet({
                        id: vet.id,
                        name: vet.name
                      });
                      setIsEmergency(false);
                      setShowScheduleForm(true);
                    }}
                  >
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
