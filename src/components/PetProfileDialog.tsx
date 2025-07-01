import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  MapPin, 
  Calendar, 
  Shield, 
  Award, 
  MessageCircle, 
  Phone, 
  Mail,
  User,
  Clock,
  Star,
  Camera,
  FileText,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  location: string;
  owner: string;
  image: string;
  vaccinated: boolean;
  gender: 'Male' | 'Female';
}

interface PetProfileDialogProps {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
}

const PetProfileDialog = ({ open, onClose, pet }: PetProfileDialogProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'contact'>('profile');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email'
  });

  if (!pet) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Here you would send the contact request to your backend
    alert('Contact request sent successfully!');
    onClose();
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
                src={`https://images.unsplash.com/photo-${pet.id === '1' ? '1552053831-71594a27632d' : '1587300003388-c5de40dab3be'}?w=800&h=400&fit=crop&auto=format`}
                alt={pet.name}
                className="w-full h-full object-cover"
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
                <h1 className="text-4xl font-bold mb-2">{pet.name}</h1>
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
                  {pet.gender === 'Female' ? '♀️ Female' : '♂️ Male'}
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
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === 'contact' 
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Contact Owner
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Owner Info */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src="/placeholder.svg" alt={pet.owner} />
                          <AvatarFallback className="bg-purple-500 text-white text-xl">
                            {pet.owner.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{pet.owner}</h3>
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Contact {pet.owner}</h3>
                    <p className="text-gray-600">Send a message to inquire about breeding opportunities</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <Input
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="email"
                          checked={contactForm.preferredContact === 'email'}
                          onChange={(e) => setContactForm({...contactForm, preferredContact: e.target.value})}
                          className="mr-2"
                        />
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="phone"
                          checked={contactForm.preferredContact === 'phone'}
                          onChange={(e) => setContactForm({...contactForm, preferredContact: e.target.value})}
                          className="mr-2"
                        />
                        <Phone className="w-4 h-4 mr-1" />
                        Phone
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Tell the owner about your pet, breeding goals, and any questions you have..."
                    />
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
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
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
