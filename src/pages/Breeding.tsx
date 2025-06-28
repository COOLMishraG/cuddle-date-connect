
import { useState } from 'react';
import Header from '@/components/Header';
import { Heart, Filter, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuthGuard from '@/hooks/useAuthGuard';
import AddPetForm from '@/components/AddPetForm';

const Breeding = () => {
  // Auth guard will redirect if not authenticated
  const { isLoading } = useAuthGuard();
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  
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
  ];  return (
    <div className="min-h-screen bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes - Enhanced with more emojis */}
      <div className="floating-shape absolute top-[8%] left-[7%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[15%] right-[10%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[18%] left-[12%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[30%] left-[25%] text-2xl float-1" style={{ animationDelay: '2s' }}>🐩</div>
      <div className="floating-shape absolute bottom-[30%] right-[18%] text-3xl float-2" style={{ animationDelay: '3s' }}>🦮</div>
      <div className="floating-shape absolute top-[45%] right-[7%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[7%] left-[35%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐕</div>
      
      {/* Additional floating emojis for breeding page */}
      <div className="floating-shape absolute top-[20%] left-[65%] text-3xl float-2" style={{ animationDelay: '1.5s' }}>🐱</div>
      <div className="floating-shape absolute top-[68%] left-[20%] text-2xl float-3" style={{ animationDelay: '2.5s' }}>🏆</div>
      <div className="floating-shape absolute bottom-[42%] left-[75%] text-4xl float-1" style={{ animationDelay: '3.5s' }}>🌟</div>
      <div className="floating-shape absolute top-[78%] right-[42%] text-3xl float-2" style={{ animationDelay: '0.5s' }}>🏅</div>
      <div className="floating-shape absolute top-[35%] left-[50%] text-2xl float-3" style={{ animationDelay: '4.5s' }}>🦴</div>
      <div className="floating-shape absolute bottom-[55%] right-[12%] text-5xl float-1" style={{ animationDelay: '1.8s' }}>💙</div>
      <div className="floating-shape absolute top-[88%] left-[45%] text-3xl float-2" style={{ animationDelay: '3.2s' }}>🎾</div>
      <div className="floating-shape absolute bottom-[12%] right-[65%] text-2xl float-3" style={{ animationDelay: '2.8s' }}>🧸</div>
      <div className="floating-shape absolute top-[25%] left-[45%] text-4xl float-1" style={{ animationDelay: '4.2s' }}>💜</div>
      <div className="floating-shape absolute bottom-[25%] left-[5%] text-3xl float-2" style={{ animationDelay: '0.8s' }}>🎈</div>
      <div className="floating-shape absolute top-[55%] right-[30%] text-2xl float-3" style={{ animationDelay: '3.8s' }}>🔥</div>
      <div className="floating-shape absolute bottom-[48%] left-[55%] text-4xl float-1" style={{ animationDelay: '1.2s' }}>🐺</div>
      <div className="floating-shape absolute top-[72%] left-[80%] text-3xl float-2" style={{ animationDelay: '4.8s' }}>🦊</div>
      <div className="floating-shape absolute top-[5%] left-[40%] text-2xl float-3" style={{ animationDelay: '2.2s' }}>🐰</div>
      <div className="floating-shape absolute bottom-[22%] right-[5%] text-4xl float-1" style={{ animationDelay: '3.7s' }}>🐈‍⬛</div>
      <div className="floating-shape absolute top-[50%] left-[15%] text-3xl float-2" style={{ animationDelay: '1.9s' }}>🌸</div>
      
      <Header />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Pet Breeding Matches</h1>
          <p className="text-muted-foreground">Find the perfect breeding partner for your pet</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>          <Button 
            className="btn-gradient"
            onClick={() => setShowAddPetForm(true)}
          >
            <Heart className="w-4 h-4 mr-2" />
            Add My Pet
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="romantic-card overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <div className="h-48 bg-[#F3EEF8]">
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
                  <span className="text-xs bg-[#F4C2C2] text-burgundy px-2 py-1 rounded">
                    {pet.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                  </span>
                  <Button size="sm" className="btn-gradient">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>      </div>
      
      {/* Add Pet Form Dialog */}
      <AddPetForm 
        open={showAddPetForm} 
        onClose={() => setShowAddPetForm(false)} 
        onPetAdded={(pet) => {
          // Here you would normally add the pet to the database
          // and update the local state
          setShowAddPetForm(false);
        }} 
      />
    </div>
  );
};

export default Breeding;
