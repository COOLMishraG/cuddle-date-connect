import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Star,
  X,
  FileText,
  Stethoscope,
  User,
  Edit
} from 'lucide-react';
import { formatAnimalType, getGenderSymbol, getAnimalEmoji } from '@/utils/petUtils';
import { PetGender, AnimalType } from '@/types/pet';
import { useAuth } from '@/contexts/AuthContext';
import { petApi, matchApi } from '@/services/api';

interface PetProfileDialogProps {
  open: boolean;
  onClose: () => void;
  pet: any;
  isOwnPet?: boolean;
}

const PetProfileDialog = ({ open, onClose, pet, isOwnPet = false }: PetProfileDialogProps) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [contactForm, setContactForm] = useState({
    message: '',
    selectedMyPet: ''
  });
  const [myPets, setMyPets] = useState<any[]>([]);
  const [loadingMyPets, setLoadingMyPets] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch current user's pets when dialog opens
  useEffect(() => {
    if (open && currentUser?.username) {
      setLoadingMyPets(true);
      petApi.getUserPets(currentUser.username)
        .then(setMyPets)
        .catch(console.error)
        .finally(() => setLoadingMyPets(false));
    }
  }, [open, currentUser]);

  if (!pet) return null;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !contactForm.selectedMyPet || !contactForm.message) {
      alert('Please select one of your pets and write a message.');
      return;
    }

    // Find the selected pet from user's pets
    const selectedMyPet = myPets.find(p => p.id === contactForm.selectedMyPet);
    if (!selectedMyPet) {
      alert('Selected pet not found. Please try again.');
      return;
    }

    // Validate animal types match
    if (selectedMyPet.animal !== pet.animal) {
      alert(`Breeding is only allowed between pets of the same species. Your ${formatAnimalType(selectedMyPet.animal)} cannot breed with a ${formatAnimalType(pet.animal)}.`);
      return;
    }

    // Validate genders are opposite
    const normalizeGender = (gender: any) => {
      if (gender === PetGender.MALE || gender === 'Male' || gender === 'male') return 'MALE';
      if (gender === PetGender.FEMALE || gender === 'Female' || gender === 'female') return 'FEMALE';
      return gender?.toUpperCase();
    };

    const myPetGender = normalizeGender(selectedMyPet.gender);
    const targetPetGender = normalizeGender(pet.gender);

    if (myPetGender === targetPetGender) {
      alert(`Breeding requires pets of opposite genders. Both pets are ${myPetGender.toLowerCase()}. Please select a pet of the opposite gender.`);
      return;
    }

    if (!myPetGender || !targetPetGender) {
      alert('Pet gender information is missing. Please ensure both pets have gender information before requesting a match.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create match request - validation passed
      const matchRequest = {
        requesterPetId: contactForm.selectedMyPet,
        recipientPetId: pet.id,
        message: contactForm.message
      };
      
      await matchApi.createMatchRequest(matchRequest);
      
      alert('Match request sent successfully! The pet owner will be notified.');
      
      // Reset form
      setContactForm({
        message: '',
        selectedMyPet: ''
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error sending match request:', error);
      alert('Failed to send match request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const petDetails = {
    weight: '65 lbs',
    height: '24 inches',
    healthStatus: 'Excellent',
    lastVetVisit: '2024-12-15',
    temperament: ['Friendly', 'Gentle', 'Playful'],
    specialNeeds: 'None',
    breeding: {
      experience: '2 previous litters',
      lastBreeding: '2023-08-15',
      geneticTesting: 'Clear for all major conditions',
      registrations: ['AKC', 'UKC']
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl mx-4"
          >
            {/* Header */}
            <div className="relative h-64 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              <img
                src={pet.imageUrl || pet.image || pet.photoUrl || `https://images.unsplash.com/photo-${pet.id === '1' ? '1552053831-71594a27632d' : '1587300003388-c5de40dab3be'}?w=800&h=400&fit=crop&auto=format`}
                alt={pet.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://images.unsplash.com/photo-1587300003388-c5de40dab3be?w=800&h=400&fit=crop&auto=format`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
              
              {/* Pet Info Overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getAnimalEmoji(pet.animal)}</span>
                  <h1 className="text-4xl font-bold">{pet.name}</h1>
                </div>
                <p className="text-xl opacity-90">{pet.breed} • {pet.age} years old</p>
                <div className="flex items-center mt-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{pet.location}</span>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-green-500 text-white">
                  {pet.vaccinated ? '✅ Health Verified' : '⚠️ Pending'}
                </Badge>
                <Badge className="bg-pink-500 text-white">
                  {getGenderSymbol(pet.gender)} {pet.gender}
                </Badge>
                <Badge className="bg-blue-500 text-white">
                  {formatAnimalType(pet.animal)}
                </Badge>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Pet Profile
              </button>
              {!isOwnPet && (
                <button
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === 'contact' 
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  onClick={() => setActiveTab('contact')}
                >
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Request Match
                </button>
              )}
              {isOwnPet && (
                <button
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === 'edit' 
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  onClick={() => setActiveTab('edit')}
                >
                  <Edit className="w-5 h-5 inline mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'edit' && isOwnPet && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Edit Pet Profile</h3>
                    <p className="text-gray-600">Update {pet.name}'s information</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                      <Input defaultValue={pet.name} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                      <Input defaultValue={pet.breed} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <Input type="number" defaultValue={pet.age} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <Select defaultValue={pet.gender}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input defaultValue={pet.location} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
                      <Select defaultValue={petDetails.healthStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Owner Info */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={pet.owner?.profileImage || pet.owner?.photoUrl || '/placeholder.svg'}
                            alt={pet.owner?.displayName || pet.owner?.name || 'Pet Owner'}
                          />
                          <AvatarFallback className="bg-purple-500 text-white text-xl">
                            {(pet.owner?.displayName || pet.owner?.name || 'Pet Owner').split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{pet.owner?.displayName || pet.owner?.name || pet.owner || 'Pet Owner'}</h3>
                          <p className="text-purple-600 font-medium">Experienced Breeder</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">4.9 (23 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Pet Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <Stethoscope className="w-5 h-5 mr-2 text-green-500" />
                          Health & Physical
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight</span>
                            <span className="font-medium">{petDetails.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Height</span>
                            <span className="font-medium">{petDetails.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Health Status</span>
                            <Badge className="bg-green-100 text-green-800">{petDetails.healthStatus}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Vet Visit</span>
                            <span className="font-medium">{petDetails.lastVetVisit}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-pink-500" />
                          Breeding Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-600 block">Experience</span>
                            <span className="font-medium">{petDetails.breeding.experience}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Last Breeding</span>
                            <span className="font-medium">{petDetails.breeding.lastBreeding}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Genetic Testing</span>
                            <Badge className="bg-blue-100 text-blue-800">{petDetails.breeding.geneticTesting}</Badge>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Registrations</span>
                            <div className="flex gap-2 mt-1">
                              {petDetails.breeding.registrations.map((reg) => (
                                <Badge key={reg} variant="outline">{reg}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Temperament */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Temperament & Personality</h3>
                      <div className="flex flex-wrap gap-2">
                        {petDetails.temperament.map((trait) => (
                          <Badge key={trait} className="bg-purple-100 text-purple-800">{trait}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'contact' && (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Breeding Match</h3>
                    <p className="text-gray-600">Send a breeding request for {pet.name} with one of your pets</p>
                  </div>
                  
                  {/* Current User Info Display */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-800 mb-3">Your Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{currentUser?.displayName || currentUser?.username || 'Anonymous User'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{currentUser?.email || 'Email not available'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Owner Contact Info Display */}
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-800 mb-3">Owner Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{pet.owner?.displayName || pet.owner?.name || pet.owner || 'Pet Owner'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{pet.owner?.email || 'Contact via match request'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{pet.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Select Your Pet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Pet for Breeding
                      <span className="text-xs text-gray-500 ml-2">
                        (Must be {formatAnimalType(pet.animal)} and opposite gender)
                      </span>
                    </label>
                    {loadingMyPets ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading your pets...</p>
                      </div>
                    ) : myPets.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">You don't have any pets yet.</p>
                        <p className="text-xs mt-1">Add a pet first to request breeding matches.</p>
                      </div>
                    ) : (() => {
                      // Helper function to check compatibility
                      const isCompatible = (myPet: any) => {
                        const normalizeGender = (gender: any) => {
                          if (gender === PetGender.MALE || gender === 'Male' || gender === 'male') return 'MALE';
                          if (gender === PetGender.FEMALE || gender === 'Female' || gender === 'female') return 'FEMALE';
                          return gender?.toUpperCase();
                        };
                        
                        const sameSpecies = myPet.animal === pet.animal;
                        const oppositeGender = normalizeGender(myPet.gender) !== normalizeGender(pet.gender);
                        const hasGenderInfo = normalizeGender(myPet.gender) && normalizeGender(pet.gender);
                        
                        return sameSpecies && oppositeGender && hasGenderInfo;
                      };

                      const compatiblePets = myPets.filter(isCompatible);
                      const incompatiblePets = myPets.filter(myPet => !isCompatible(myPet));

                      return (
                        <div className="space-y-3">
                          <Select 
                            value={contactForm.selectedMyPet} 
                            onValueChange={(value) => setContactForm({...contactForm, selectedMyPet: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose which of your pets to breed" />
                            </SelectTrigger>
                            <SelectContent>
                              {compatiblePets.length > 0 && (
                                <>
                                  <div className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50">
                                    ✅ Compatible Pets
                                  </div>
                                  {compatiblePets.map((myPet) => (
                                    <SelectItem key={myPet.id} value={myPet.id}>
                                      <div className="flex items-center gap-2">
                                        <span>{getAnimalEmoji(myPet.animal)}</span>
                                        <span className="font-semibold text-gray-900">{myPet.name}</span>
                                        <span className="text-sm text-gray-800">({myPet.breed})</span>
                                        <span className="text-xs text-gray-700">
                                          {getGenderSymbol(myPet.gender)} {myPet.age}y
                                        </span>
                                        <span className="text-xs text-green-700 font-bold">✓</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                              
                              {incompatiblePets.length > 0 && (
                                <>
                                  {compatiblePets.length > 0 && (
                                    <div className="border-t border-gray-200 my-1"></div>
                                  )}
                                  <div className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50">
                                    ❌ Incompatible Pets
                                  </div>
                                  {incompatiblePets.map((myPet) => {
                                    const normalizeGender = (gender: any) => {
                                      if (gender === PetGender.MALE || gender === 'Male' || gender === 'male') return 'MALE';
                                      if (gender === PetGender.FEMALE || gender === 'Female' || gender === 'female') return 'FEMALE';
                                      return gender?.toUpperCase();
                                    };
                                    
                                    const sameSpecies = myPet.animal === pet.animal;
                                    const sameGender = normalizeGender(myPet.gender) === normalizeGender(pet.gender);
                                    const reason = !sameSpecies ? 'Different species' : sameGender ? 'Same gender' : 'Missing gender info';
                                    
                                    return (
                                      <SelectItem key={myPet.id} value={myPet.id} disabled>
                                        <div className="flex items-center gap-2 opacity-50">
                                          <span>{getAnimalEmoji(myPet.animal)}</span>
                                          <span className="font-semibold text-gray-700">{myPet.name}</span>
                                          <span className="text-sm text-gray-600">({myPet.breed})</span>
                                          <span className="text-xs text-gray-500">
                                            {getGenderSymbol(myPet.gender)} {myPet.age}y
                                          </span>
                                          <span className="text-xs text-red-700 font-bold">({reason})</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          
                          {compatiblePets.length === 0 && myPets.length > 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                <strong>No compatible pets found.</strong> To breed with {pet.name} (a {getGenderSymbol(pet.gender)} {formatAnimalType(pet.animal)}), you need a {pet.gender === PetGender.MALE || pet.gender === 'Male' || pet.gender === 'male' ? 'female' : 'male'} {formatAnimalType(pet.animal)}.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message to Owner</label>
                    <Textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Introduce yourself and your pet, share your breeding goals, and ask any questions you have about their pet..."
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={onClose}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={submitting || !contactForm.selectedMyPet || !contactForm.message}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {submitting ? 'Sending...' : 'Send Match Request'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetProfileDialog;
