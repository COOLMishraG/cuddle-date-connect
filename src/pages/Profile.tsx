import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, Sparkles, Zap, Crown, Star, Trophy, Camera, Edit, Share2, Settings, User, MapPin, Mail, Phone, Calendar, Award, TrendingUp, Activity, Target, Clock, Users, DollarSign, Stethoscope, Shield, Bell, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ProfileDashboard from '../components/ProfileDashboard';
import AddPetForm from '@/components/AddPetForm';
import useAuthGuard from '@/hooks/useAuthGuard';
import { toast } from '@/hooks/use-toast';
import { userApi, petApi, vetApi } from '@/services/api';
import { matchApi } from '@/services/api';
import { Pet } from '@/types/pet';
import { UserRole } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const Profile = () => {  
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [matches, setMatches] = useState<any[]>([]);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [activeMatchTab, setActiveMatchTab] = useState('pending');
  const [isEditingServices, setIsEditingServices] = useState(false);
  
  // Form state - User entity fields + sitter spec fields
  const [formData, setFormData] = useState({
    // User entity fields
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    location: '',
    role: 'owner',
    // Sitter spec fields (separate entity)
    price: '',
    rating: '',
    available: true,
    description: '',
    specialties: [] as string[],
    petSatCount: '',
    experience: '',
    responseTime: '',
    // Additional fields for services/practice
    services: '',
    capacity: '',
    rate: '',
    specialty: '',
    license: '',
    availability: ''
  });

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
    { id: 'pets', label: 'My Pets', icon: Heart, color: 'pink' },
    { id: 'matches', label: 'My Matches', icon: Users, color: 'indigo' },
    { id: 'services', label: 'Services', icon: Briefcase, color: 'green' },
    { id: 'practice', label: 'Practice', icon: Stethoscope, color: 'purple' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Don't track mouse movement when dialog is open
      if (!showMatchDialog) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showMatchDialog]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (showMatchDialog) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
      // Re-enable pointer events for the dialog
      const dialogElement = document.querySelector('[data-dialog="match-dialog"]');
      if (dialogElement) {
        (dialogElement as HTMLElement).style.pointerEvents = 'auto';
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    };
  }, [showMatchDialog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!currentUser?.id) {
        toast({ title: "Error", description: "Please log in again", variant: "destructive" });
        return;
      }
      
      // Only send fields that exist in the User entity
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        role: formData.role.toUpperCase() as UserRole,
        // Note: We don't send id, username, displayName, password, profileImage, 
        // isVerified, googleId, createdAt, updatedAt as they are managed by the backend
      };
      
      await userApi.updateUserByUsername(currentUser.username, userData);
      
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddPet = async (pet: Pet) => {
    try {
      if (!currentUser?.id) {
        toast({ title: "Error", description: "Please log in again", variant: "destructive" });
        return;
      }

      if (editingPet) {
        const result = await petApi.updatePet(editingPet.id, {
          ...pet,
          userId: currentUser.id
        });
        
        setPets(pets.map(p => p.id === pet.id ? result : p));
        setEditingPet(null);
      } else {
        const result = await petApi.createPet({
          ...pet,
          userId: currentUser.id
        }, currentUser.username);
        
        setPets([...pets, result]);
      }
      
      setShowAddPetForm(false);
      toast({ title: "Success", description: `Pet ${editingPet ? 'updated' : 'added'} successfully` });
    } catch (error) {
      console.error('Error adding/updating pet:', error);
      toast({ title: "Error", description: `Failed to ${editingPet ? 'update' : 'add'} pet`, variant: "destructive" });
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setShowAddPetForm(true);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'sitter': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'vet': return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setProfileImage(imageUrl);
    // TODO: Save to backend
    console.log('Profile image changed to:', imageUrl);
  };

  const getSectionColorClass = (color: string) => {
    const colors = {
      indigo: 'from-indigo-500 to-indigo-700',
      blue: 'from-blue-500 to-blue-700',
      pink: 'from-pink-500 to-pink-700',
      green: 'from-green-500 to-green-700',
      purple: 'from-purple-500 to-purple-700',
      gray: 'from-gray-500 to-gray-700'
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userProfile = await userApi.getUserProfile(currentUser.id);
        const userPets = await petApi.getUserPets(currentUser.username || currentUser.id);
        const userMatches = await matchApi.getReceivedMatchRequests(currentUser.username);
        
        // Fetch sitter spec data if user is a sitter
        let sitterSpec = null;
        if (currentUser.username) {
          try {
            sitterSpec = await userApi.getSitterSpecByUsername(currentUser.username);
          } catch (error) {
            console.log('No sitter spec found for user, using defaults');
          }
        }
        
        if (userProfile) {
          setFormData({
            // User entity fields
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            location: userProfile.location || '',
            role: userProfile.role?.toLowerCase() || 'owner',
            // Sitter spec fields (from separate entity)
            price: sitterSpec?.price?.toString() || '',
            rating: sitterSpec?.rating?.toString() || '',
            available: sitterSpec?.available !== undefined ? sitterSpec.available : true,
            description: sitterSpec?.description || '',
            specialties: sitterSpec?.specialties || [],
            petSatCount: sitterSpec?.petSatCount?.toString() || '',
            experience: sitterSpec?.experience?.toString() || '',
            responseTime: sitterSpec?.responseTime || '',
            // Additional legacy fields
            services: userProfile.services || '',
            capacity: userProfile.capacity || '',
            rate: userProfile.rate || '',
            specialty: userProfile.specialty || '',
            license: userProfile.license || '',
            availability: userProfile.availability || ''
          });
        }
        
        setPets(userPets || []);
        setMatches(userMatches || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({ title: "Error", description: "Failed to load profile data", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSaveSitterSpec = async () => {
    try {
      if (!currentUser?.username) {
        toast({ title: "Error", description: "Username required for sitter spec update", variant: "destructive" });
        return;
      }

      // Only send sitter spec fields
      const sitterSpecData = {
        price: formData.price ? Number(formData.price) : null,
        rating: formData.rating ? Number(formData.rating) : null,
        available: formData.available,
        description: formData.description,
        specialties: formData.specialties,
        petSatCount: formData.petSatCount ? Number(formData.petSatCount) : 0,
        experience: formData.experience ? Number(formData.experience) : 0,
        responseTime: formData.responseTime
      };

      await userApi.updateSitterSpec(currentUser.username, sitterSpecData);
      
      toast({ title: "Success", description: "Sitter services updated successfully" });
      setIsEditingServices(false);
    } catch (error) {
      console.error('Error updating sitter spec:', error);
      toast({ title: "Error", description: "Failed to update sitter services", variant: "destructive" });
    }
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-8 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <User className="w-6 h-6 text-blue-600" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Full Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full text-lg p-4 h-12"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full text-lg p-4 h-12"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full text-lg p-4 h-12"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full text-lg p-4 h-12"
              placeholder="Enter your location"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Bio</label>
            <Textarea
              name="bio"
              value=""
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={5}
              className="w-full text-lg p-4"
              placeholder="Tell us about yourself... (Note: Bio field will be added to backend later)"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange('role', value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner" className="text-lg">Pet Owner</SelectItem>
                <SelectItem value="sitter" className="text-lg">Pet Sitter</SelectItem>
                <SelectItem value="vet" className="text-lg">Veterinarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-8 flex gap-4">
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-8 py-3">
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="text-lg px-8 py-3">
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderPets = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            My Pets ({pets.length})
          </h3>
          <Button
            onClick={() => setShowAddPetForm(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
          >
            Add Pet
          </Button>
        </div>
        
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No pets added yet</p>
            <p className="text-gray-400">Add your first furry friend!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer"
                onClick={() => handleEditPet(pet)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={pet.imageUrl || `/placeholder.svg`} alt={pet.name} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg font-bold">
                      {pet.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">{pet.name}</h4>
                    <p className="text-gray-600">{pet.breed}</p>
                    <Badge className="mt-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                      {pet.age} years old
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">{pet.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {pet.vaccinated && (
                    <Badge variant="secondary" className="text-xs">
                      Vaccinated
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {pet.gender}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderServices = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            Services & Offerings
          </h3>
          {formData.role === 'sitter' && (
            <Button
              onClick={() => setIsEditingServices(!isEditingServices)}
              variant="outline"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditingServices ? 'Cancel Edit' : 'Edit Services'}
            </Button>
          )}
        </div>
        
        {formData.role === 'sitter' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditingServices}
                  rows={3}
                  className="w-full"
                  placeholder="Tell clients about your pet sitting services..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($)</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={!isEditingServices}
                  className="w-full"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                <Input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                  disabled={!isEditingServices}
                  className="w-full"
                  placeholder="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <Input
                  name="responseTime"
                  value={formData.responseTime}
                  onChange={handleInputChange}
                  disabled={!isEditingServices}
                  className="w-full"
                  placeholder="2 hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pets Sat Count</label>
                <Input
                  name="petSatCount"
                  type="number"
                  value={formData.petSatCount}
                  onChange={handleInputChange}
                  disabled={!isEditingServices}
                  className="w-full"
                  placeholder="50"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Available for Bookings</label>
                <Switch
                  checked={formData.available}
                  disabled={!isEditingServices}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
              <div className="flex flex-wrap gap-2">
                {['Dogs', 'Cats', 'Birds', 'Small Animals', 'Exotic Pets', 'Senior Pets', 'Puppies/Kittens'].map((specialty) => (
                  <Button
                    key={specialty}
                    type="button"
                    variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                    size="sm"
                    disabled={!isEditingServices}
                    onClick={() => handleSpecialtyChange(specialty)}
                    className="text-xs"
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Legacy fields for backward compatibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Legacy: Services Offered</label>
                <Textarea
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={2}
                  className="w-full text-sm"
                  placeholder="Pet sitting, dog walking, overnight care..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Legacy: Capacity</label>
                <Input
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm"
                  placeholder="Number of pets you can handle"
                />
              </div>
            </div>
          </div>
        )}
        
        {formData.role === 'owner' && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Services section is for pet sitters</p>
            <p className="text-gray-400">Switch to sitter role to access service settings</p>
          </div>
        )}
        
        {formData.role === 'vet' && (
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Use the Practice section for veterinary services</p>
            <p className="text-gray-400">Manage your veterinary practice details there</p>
          </div>
        )}
        
        {formData.role === 'sitter' && (
          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  Save Profile Info
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel Profile Edit
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                Edit Profile
              </Button>
            )}
            
            {isEditingServices && (
              <Button onClick={handleSaveSitterSpec} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                Save Services
              </Button>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderPractice = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-purple-600" />
          Veterinary Practice
        </h3>
        
        {formData.role === 'vet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <Input
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
                placeholder="Small animals, exotic pets, surgery..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <Input
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
                placeholder="Your veterinary license number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours & Availability</label>
              <Textarea
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full"
                placeholder="Mon-Fri 9AM-6PM, Emergency calls available..."
              />
            </div>
          </div>
        )}
        
        {formData.role !== 'vet' && (
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Practice section is for veterinarians</p>
            <p className="text-gray-400">Switch to veterinarian role to access practice settings</p>
          </div>
        )}
        
        {isEditing && formData.role === 'vet' && (
          <div className="mt-6 flex gap-4">
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Account Settings
        </h3>
        
        <div className="space-y-6">
          {/* Privacy Settings */}
          <div>
            <h4 className="font-semibold mb-4">Privacy Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Online Status</p>
                  <p className="text-sm text-gray-600">Let others see when you're online</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Messages</p>
                  <p className="text-sm text-gray-600">Receive messages from other users</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div>
            <h4 className="font-semibold mb-4">Notifications</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get real-time updates</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Reminders</p>
                  <p className="text-sm text-gray-600">Reminders for upcoming bookings</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div>
            <h4 className="font-semibold mb-4">Account Actions</h4>
            <div className="space-y-4">
              <Button 
                onClick={handleSignOut}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white"
              >
                Sign Out
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderMatches = () => {
    const pendingMatches = matches.filter(match => match.status === 'PENDING');
    const completedMatches = matches.filter(match => match.status === 'APPROVED');
    const rejectedMatches = matches.filter(match => match.status === 'REJECTED');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              My Matches ({matches.length})
            </h3>
            <Button
              onClick={() => setShowMatchDialog(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              View All Matches
            </Button>
          </div>
          
          {/* Match Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{pendingMatches.length}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Awaiting response</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{completedMatches.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Successfully matched</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{rejectedMatches.length}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Did not match</p>
            </motion.div>
          </div>

          {/* Recent Matches Preview */}
          <div>
            <h4 className="font-semibold mb-4">Recent Matches</h4>
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No matches yet</p>
                <p className="text-gray-400">Start connecting with other pet owners!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.slice(0, 3).map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={match.requesterPet?.imageUrl || '/placeholder.svg'} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                        {match.requesterPet?.name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{match.requesterPet?.name || 'Unknown Pet'}</p>
                      <p className="text-sm text-gray-600">
                        {match.requester?.displayName || match.requester?.username || 'Unknown User'}
                      </p>
                    </div>
                    <Badge className={`${
                      match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      match.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {match.status}
                    </Badge>
                  </motion.div>
                ))}
                {matches.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    and {matches.length - 3} more matches...
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  const MatchDialog = () => {
    const pendingMatches = matches.filter(match => match.status === 'PENDING');
    const completedMatches = matches.filter(match => match.status === 'APPROVED');
    const rejectedMatches = matches.filter(match => match.status === 'REJECTED');

    const getCurrentMatches = () => {
      switch (activeMatchTab) {
        case 'pending': return pendingMatches;
        case 'completed': return completedMatches;
        case 'rejected': return rejectedMatches;
        default: return pendingMatches;
      }
    };

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    if (!showMatchDialog) return null;

    return (
      <AnimatePresence>
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ 
            pointerEvents: 'auto',
            zIndex: 9999
          }}
          data-dialog="match-dialog"
          onMouseMove={(e) => e.stopPropagation()}
          onClick={(e) => {
            // Only close if clicking the backdrop itself, not the modal content
            if (e.target === e.currentTarget) {
              setShowMatchDialog(false);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden relative"
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6" />
                My Matches ({matches.length})
              </h2>
              <Button
                onClick={() => setShowMatchDialog(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveMatchTab('pending')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeMatchTab === 'pending'
                    ? 'border-b-2 border-yellow-500 text-yellow-600 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending ({pendingMatches.length})
                </div>
              </button>
              <button
                onClick={() => setActiveMatchTab('completed')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeMatchTab === 'completed'
                    ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Completed ({completedMatches.length})
                </div>
              </button>
              <button
                onClick={() => setActiveMatchTab('rejected')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeMatchTab === 'rejected'
                    ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  Rejected ({rejectedMatches.length})
                </div>
              </button>
            </div>

            {/* Match Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {getCurrentMatches().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeMatchTab === 'pending' && <Clock className="w-8 h-8 text-gray-400" />}
                    {activeMatchTab === 'completed' && <Trophy className="w-8 h-8 text-gray-400" />}
                    {activeMatchTab === 'rejected' && <X className="w-8 h-8 text-gray-400" />}
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    No {activeMatchTab} matches
                  </p>
                  <p className="text-gray-400 text-sm">
                    {activeMatchTab === 'pending' && 'No pending match requests at the moment'}
                    {activeMatchTab === 'completed' && 'No completed matches yet'}
                    {activeMatchTab === 'rejected' && 'No rejected matches'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getCurrentMatches().map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Requester Pet */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={match.requesterPet?.imageUrl || '/placeholder.svg'} />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-lg">
                                {match.requesterPet?.name?.charAt(0) || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-lg">{match.requesterPet?.name || 'Unknown Pet'}</h4>
                              <p className="text-gray-600">{match.requesterPet?.breed || 'Unknown breed'}</p>
                              <p className="text-sm text-gray-500">
                                Owner: {match.requester?.displayName || match.requester?.username || 'Unknown User'}
                              </p>
                            </div>
                          </div>
                          
                          {match.message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700">{match.message}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatTimeAgo(match.createdAt)}
                            </span>
                            <Badge className={`${
                              match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              match.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {match.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Your Pet */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={match.recipientPet?.imageUrl || '/placeholder.svg'} />
                              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg">
                                {match.recipientPet?.name?.charAt(0) || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-lg">{match.recipientPet?.name || 'Your Pet'}</h4>
                              <p className="text-gray-600">{match.recipientPet?.breed || 'Unknown breed'}</p>
                              <p className="text-sm text-gray-500">Your pet</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'pets': return renderPets();
      case 'matches': return renderMatches();
      case 'services': return renderServices();
      case 'practice': return renderPractice();
      case 'settings': return renderSettings();
      default: return renderPersonalInfo();
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          <motion.div
            className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-300/20 to-indigo-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                  initial={{
                    top: -10,
                    left: Math.random() * window.innerWidth,
                    rotate: 0,
                  }}
                  animate={{
                    top: window.innerHeight + 10,
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <Header />
        
        <div className="relative z-10 pt-20">
          {/* Hero Profile Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-6 py-8"
          >
            <ProfileDashboard 
              currentUser={currentUser}
              profileImage={profileImage}
              formData={formData}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onSignOut={signOut}
              pets={pets}
              onSectionChange={setActiveSection}
              onProfileImageChange={handleProfileImageChange}
            />
          </motion.div>

          {/* Horizontal Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-7xl mx-auto px-6 py-4"
          >
            <Card className="p-2 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${getSectionColorClass(section.color)} text-white shadow-lg`
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-4 h-4" />
                      {section.label}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-6 py-8"
          >
            {renderContent()}
          </motion.div>
        </div>
        
        {/* Add/Edit Pet Form Dialog */}
        <AddPetForm 
          open={showAddPetForm} 
          onClose={() => {
            setShowAddPetForm(false);
            setEditingPet(null);
          }} 
          onPetAdded={handleAddPet} 
          existingPet={editingPet}
        />

        {/* Match Dialog */}
        <MatchDialog />
      </div>
    </TooltipProvider>
  );
};

export default Profile;
