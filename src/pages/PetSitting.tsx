
import Header from '@/components/Header';
import { Users, Star, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PetSitting = () => {
  const sitters = [
    {
      id: '1',
      name: 'Alice Johnson',
      experience: '5 years',
      location: 'San Francisco, CA',
      rating: 4.9,
      price: '$25/day',
      image: '/placeholder.svg',
      available: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      experience: '3 years',
      location: 'Los Angeles, CA',
      rating: 4.8,
      price: '$20/day',
      image: '/placeholder.svg',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Pet Sitting Services</h1>
          <p className="text-muted-foreground">Find trusted sitters for your beloved pets</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Check Availability
          </Button>
          <Button className="btn-gradient">
            <Users className="w-4 h-4 mr-2" />
            Become a Sitter
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitters.map((sitter) => (
            <Card key={sitter.id} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <div className="h-48 bg-gray-200">
                <img src={sitter.image} alt={sitter.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg fredoka">{sitter.name}</h3>
                <p className="text-sm text-muted-foreground">{sitter.experience} experience</p>
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {sitter.location}
                </div>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{sitter.rating}</span>
                  <span className="ml-auto font-semibold text-accent">{sitter.price}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-xs px-2 py-1 rounded ${sitter.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sitter.available ? 'Available' : 'Busy'}
                  </span>
                  <Button size="sm" className="btn-gradient" disabled={!sitter.available}>
                    Book Now
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

export default PetSitting;
