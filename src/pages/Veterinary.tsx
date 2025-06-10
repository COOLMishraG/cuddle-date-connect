
import Header from '@/components/Header';
import { Calendar, MapPin, Star, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Veterinary = () => {
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Veterinary Services</h1>
          <p className="text-muted-foreground">Connect with certified veterinarians in your area</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Button>
          <Button className="btn-gradient">
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
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-xs px-2 py-1 rounded ${vet.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {vet.available ? 'Available' : 'Busy'}
                  </span>
                  <Button size="sm" className="btn-gradient" disabled={!vet.available}>
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Veterinary;
