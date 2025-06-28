
import { useState } from 'react';
import Header from '../components/Header';
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-24 w-80 h-80 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Pet Breeding Matches
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find the perfect breeding partner for your beloved pet with our verified and health-checked network
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline" 
              className="glass-card border-0 bg-white/20 hover:bg-white/30 text-gray-700 px-8 py-3 h-auto"
            >
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </Button>
            <Button 
              className="premium-gradient text-white px-8 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowAddPetForm(true)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Add My Pet
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Breeding Partners</h2>
          <p className="text-gray-600">All pets are health-checked and verified</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <Card key={pet.id} className="glass-card border-0 bg-white/40 backdrop-blur-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <img 
                  src={`https://images.unsplash.com/photo-${pet.id === '1' ? '1552053831-71594a27632d' : '1587300003388-c5de40dab3be'}?w=400&h=300&fit=crop&auto=format`} 
                  alt={pet.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {pet.vaccinated ? '✅ Verified' : '⚠️ Pending'}
                </div>
                <div className="absolute top-3 left-3 bg-pink-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {pet.gender === 'Female' ? '♀️ Female' : '♂️ Male'}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
                  <p className="text-purple-600 font-medium">{pet.breed}</p>
                  <p className="text-sm text-gray-600">{pet.age} years old</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {pet.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="w-4 h-4 mr-2 text-red-400" />
                    Owner: {pet.owner}
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Health Certified
                  </span>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Pedigree
                  </span>
                </div>
                
                <Button 
                  className="w-full premium-gradient text-white hover:shadow-lg transition-all duration-300"
                >
                  View Profile & Contact
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Breeding Network?</h2>
            <p className="text-gray-600">Professional, safe, and responsible breeding matches</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Health Verified</h3>
              <p className="text-gray-600">All pets undergo comprehensive health screenings and genetic testing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Filter className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Matching</h3>
              <p className="text-gray-600">Advanced algorithms ensure optimal breeding compatibility and genetics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-pink-600 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Local Network</h3>
              <p className="text-gray-600">Find breeding partners in your area with verified local breeders</p>
            </div>
          </div>
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
