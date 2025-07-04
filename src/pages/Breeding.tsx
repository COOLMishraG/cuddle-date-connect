
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Heart, Filter, MapPin, ChevronDown, ChevronUp, Plus, Edit, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuthGuard from '@/hooks/useAuthGuard';
import AddPetForm from '@/components/AddPetForm';
import PetProfileDialog from '@/components/PetProfileDialog';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { matchApi, petApi } from '@/services/api';
import { AnimalType, PetGender } from '@/types/pet';
import { formatAnimalType, getGenderSymbol, getAnimalEmoji } from '@/utils/petUtils';

const Breeding = () => {
  // Auth guard will redirect if not authenticated
  const { isLoading } = useAuthGuard();
  const { currentUser } = useAuth();
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [isMyPetsMinimized, setIsMyPetsMinimized] = useState(false);
  const [showMyPetsWidget, setShowMyPetsWidget] = useState(true);
  const [pets, setPets] = useState<any[]>([]);
  const [myPets, setMyPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pet matches and user's pets from API
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoadingPets(true);
        setError(null);

        // Fetch breeding matches
        const matchData = await matchApi.getPetMatches();
        
        // Fetch user's pets if authenticated
        let userPetsData = [];
        if (currentUser?.username) {
          try {
            userPetsData = await petApi.getUserPets(currentUser.username);
            setMyPets(userPetsData);
          } catch (petError) {
            console.warn('Could not fetch user pets:', petError);
            // Continue without user pets if there's an error
          }
        }

        // Filter out current user's pets from the main breeding matches
        const filteredPets = matchData.filter(pet => {
          // Check if this pet belongs to the current user
          const isUserPet = userPetsData.some(userPet => userPet.id === pet.id);
          const isOwnerMatch = pet.owner?.username === currentUser?.username || 
                              pet.ownerUsername === currentUser?.username ||
                              pet.owner?.displayName === currentUser?.displayName ||
                              pet.owner?.name === currentUser?.displayName;
          
          return !isUserPet && !isOwnerMatch;
        });
        
        setPets(filteredPets);

      } catch (err) {
        console.error('Error fetching pet data:', err);
        setError('Failed to load pet data. Please try again later.');
        // Use fallback mock data for development (excluding user pets)
        setPets([
          {
            id: '1',
            name: 'Luna',
            animal: AnimalType.DOG,
            breed: 'Golden Retriever',
            age: 3,
            location: 'San Francisco, CA',
            owner: { displayName: 'Sarah Wilson' },
            image: '/placeholder.svg',
            vaccinated: true,
            gender: PetGender.FEMALE
          },
          {
            id: '2',
            name: 'Max',
            animal: AnimalType.DOG,
            breed: 'Labrador',
            age: 4,
            location: 'Los Angeles, CA',
            owner: { displayName: 'John Smith' },
            image: '/placeholder.svg',
            vaccinated: true,
            gender: PetGender.MALE
          }
        ]);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPetData();
  }, [currentUser]);

  // Refresh data when a new pet is added
  const handlePetAdded = () => {
    setShowAddPetForm(false);
    // Refresh both user pets and breeding matches to ensure proper filtering
    if (currentUser?.username) {
      Promise.all([
        petApi.getUserPets(currentUser.username),
        matchApi.getPetMatches()
      ]).then(([userPetsData, matchData]) => {
        setMyPets(userPetsData);
        
        // Filter out current user's pets from the main breeding matches
        const filteredPets = matchData.filter(pet => {
          const isUserPet = userPetsData.some(userPet => userPet.id === pet.id);
          const isOwnerMatch = pet.owner?.username === currentUser?.username || 
                              pet.ownerUsername === currentUser?.username ||
                              pet.owner?.displayName === currentUser?.displayName ||
                              pet.owner?.name === currentUser?.displayName;
          
          return !isUserPet && !isOwnerMatch;
        });
        
        setPets(filteredPets);
      }).catch(console.error);
    }
  };

  return (
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
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
        
        {loadingPets ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading breeding partners...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No breeding partners available at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new matches!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <Card key={pet.id} className="glass-card border-0 bg-white/40 backdrop-blur-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img 
                    src={pet.image || pet.photoUrl || `https://images.unsplash.com/photo-${pet.id === '1' ? '1552053831-71594a27632d' : '1587300003388-c5de40dab3be'}?w=400&h=300&fit=crop&auto=format`} 
                    alt={pet.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-1587300003388-c5de40dab3be?w=400&h=300&fit=crop&auto=format`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {pet.vaccinated || pet.healthStatus === 'verified' ? '✅ Verified' : '⚠️ Pending'}
                  </div>
                  <div className="absolute top-3 left-3 bg-pink-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {getGenderSymbol(pet.gender)} {pet.gender === PetGender.FEMALE || pet.gender === 'Female' || pet.gender === 'female' ? 'Female' : 'Male'}
                  </div>
                  {/* Animal type badge */}
                  <div className="absolute bottom-3 left-3 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {getAnimalEmoji(pet.animal)} {formatAnimalType(pet.animal)}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
                    <p className="text-purple-600 font-medium">{pet.breed}</p>
                    <p className="text-sm text-gray-600">{pet.age} years old • {formatAnimalType(pet.animal)}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {pet.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="w-4 h-4 mr-2 text-red-400" />
                      Owner: {pet.owner?.displayName || pet.owner?.name || pet.ownerName || 'Unknown'}
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
                    onClick={() => {
                      setSelectedPet(pet);
                      setShowPetProfile(true);
                    }}
                  >
                    View Profile & Request Match
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
        onPetAdded={handlePetAdded} 
      />
      
      {/* Pet Profile Dialog */}
      <PetProfileDialog
        open={showPetProfile}
        onClose={() => {
          setShowPetProfile(false);
          setSelectedPet(null);
        }}
        pet={selectedPet}
      />

      {/* Floating My Pets Widget */}
      {currentUser && showMyPetsWidget && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed top-24 right-6 z-40 w-80"
        >
          <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <h3 className="font-bold text-lg">My Pets</h3>
                  <Badge className="bg-white/20 text-white text-xs">
                    {myPets.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-auto"
                    onClick={() => setIsMyPetsMinimized(!isMyPetsMinimized)}
                  >
                    {isMyPetsMinimized ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-auto"
                    onClick={() => setShowMyPetsWidget(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {!isMyPetsMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="p-4">
                    {myPets.length > 0 ? (
                      <div className="relative">
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {myPets.map((pet) => (
                            <div
                              key={pet.id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 cursor-pointer group"
                            >
                              <div className="relative">
                                <img
                                  src={pet.image || pet.photoUrl || `https://images.unsplash.com/photo-1551717743-49959800b1f6?w=200&h=200&fit=crop&auto=format`}
                                  alt={pet.name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://images.unsplash.com/photo-1551717743-49959800b1f6?w=200&h=200&fit=crop&auto=format`;
                                  }}
                                />                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">
                                  {pet.gender === PetGender.FEMALE || pet.gender === 'Female' || pet.gender === 'female' ? '♀' : '♂'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">
                                {pet.name}
                              </h4>
                              <p className="text-sm text-purple-600 truncate">
                                {pet.breed}
                              </p>
                              <p className="text-xs text-gray-500">
                                {pet.age} years old • {formatAnimalType(pet.animal)}
                              </p>
                                <Badge 
                                  className={`text-xs mt-1 ${
                                    pet.status === 'Available for breeding' || pet.breedingStatus === 'available'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {pet.status || pet.breedingStatus || 'Available'}
                                </Badge>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-gray-400 hover:text-purple-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        {/* Scroll hint - only show if there are more than 4 pets */}
                        {myPets.length > 4 && (
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No pets added yet</p>
                        <p className="text-xs mt-1">Add your pets to find breeding matches</p>
                      </div>
                    )}
                    
                    {/* Add Pet Button */}
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => setShowAddPetForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Pet
                    </Button>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* Show Widget Button (when hidden) */}
      {currentUser && !showMyPetsWidget && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-24 right-6 z-40"
        >
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl rounded-full p-3"
            onClick={() => setShowMyPetsWidget(true)}
          >
            <Heart className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Breeding;
