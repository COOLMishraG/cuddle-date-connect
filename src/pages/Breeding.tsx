
import Header from '@/components/Header';
import { Heart, Filter, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Breeding = () => {
  const pets = [
    {
      id: '1',
      name: 'Luna',
      breed: 'Golden Retriever',
      age: 3,
      location: 'San Francisco, CA',
      owner: 'Sarah Wilson',
      image: '/placeholder.svg',
      vaccinated: true,
      gender: 'Female'
    },
    {
      id: '2',
      name: 'Max',
      breed: 'Labrador',
      age: 4,
      location: 'Los Angeles, CA',
      owner: 'John Smith',
      image: '/placeholder.svg',
      vaccinated: true,
      gender: 'Male'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Pet Breeding Matches</h1>
          <p className="text-muted-foreground">Find the perfect breeding partner for your pet</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button className="btn-gradient">
            <Heart className="w-4 h-4 mr-2" />
            Add My Pet
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <div className="h-48 bg-gray-200">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg fredoka">{pet.name}</h3>
                <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age} years • {pet.gender}</p>
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {pet.location}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {pet.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                  </span>
                  <Button size="sm" className="btn-gradient">
                    View Profile
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

export default Breeding;
