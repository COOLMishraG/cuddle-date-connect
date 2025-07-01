import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, Sparkles, Zap, Crown, Star, Trophy, Camera, Edit, Share2, Settings, User, MapPin, Mail, Phone, Calendar, Award, TrendingUp, Activity, Target, Clock, Users, DollarSign, Stethoscope, Shield, Bell, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import AddPetForm from '@/components/AddPetForm';
import useAuthGuard from '@/hooks/useAuthGuard';
import { toast } from '@/hooks/use-toast';
import { userApi, petApi } from '@/services/api';
import { uploadImageToCloudinary } from '@/services/cloudinary';
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
  const { currentUser, signOut, refreshUserData } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    location: '',
    bio: '',
    role: 'owner',
    // Sitter-specific fields
    services: '',
    capacity: '',
    rate: '',
    // Vet-specific fields
    specialty: '',
    license: '',
    availability: ''
  });

  // Spectacular stats and achievements
  const stats = [
    { id: 'rating', label: 'Rating', value: '4.9', max: 5, icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100', gradient: 'from-yellow-400 to-orange-500' },
    { id: 'bookings', label: 'Bookings', value: '127', max: 200, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-100', gradient: 'from-blue-400 to-cyan-500' },
    { id: 'reviews', label: 'Reviews', value: '89', max: 100, icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100', gradient: 'from-red-400 to-pink-500' },
    { id: 'response', label: 'Response Rate', value: '98%', max: 100, icon: Zap, color: 'text-green-500', bgColor: 'bg-green-100', gradient: 'from-green-400 to-emerald-500' }
  ];

  const achievements = [
    { title: 'Top Rated', icon: Trophy, color: 'text-yellow-600', bgGradient: 'from-yellow-400 to-orange-500', description: 'Consistently high ratings' },
    { title: 'Quick Responder', icon: Zap, color: 'text-blue-600', bgGradient: 'from-blue-400 to-cyan-500', description: 'Lightning-fast responses' },
    { title: 'Super Host', icon: Crown, color: 'text-purple-600', bgGradient: 'from-purple-400 to-pink-500', description: 'Exceptional hosting' },
    { title: 'Rising Star', icon: TrendingUp, color: 'text-green-600', bgGradient: 'from-green-400 to-emerald-500', description: 'Rapidly improving' }
  ];

  const sections = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'indigo' },
    { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
    { id: 'pets', label: 'My Pets', icon: Heart, color: 'pink' },
    { id: 'services', label: 'Services', icon: Briefcase, color: 'green' },
    { id: 'practice', label: 'Practice', icon: Stethoscope, color: 'purple' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      
      const userData = {
        ...formData,
        id: currentUser.id,
        role: formData.role.toUpperCase() as UserRole,
      };
      
      await userApi.updateUser(currentUser.id, userData);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for immediate preview
    const tempUrl = URL.createObjectURL(file);
    setProfileImage(tempUrl);

    try {
      const username = currentUser?.username;
      if (!username) {
        throw new Error('Username not found');
      }

      // Step 1: Upload image to Cloudinary
      console.log('🔄 Uploading image to Cloudinary...');
      const cloudinaryURI = await uploadImageToCloudinary(file, 'profile-photos');
      console.log('✅ Cloudinary URI generated:', cloudinaryURI);

      // Step 2: Update user's profileImage field using existing updateUserByUsername method
      console.log('🔄 Updating user profileImage with username:', username);
      const response = await userApi.updateUserByUsername(username, { 
        profileImage: cloudinaryURI 
      });
      
      // Update with the Cloudinary URL
      setProfileImage(cloudinaryURI);
      
      // Step 3: Refresh user data in AuthContext to ensure latest profile data
      console.log('🔄 Refreshing user data in context...');
      await refreshUserData();
      
      // Clean up the temporary URL
      URL.revokeObjectURL(tempUrl);
      
      toast({ title: "Success", description: "Profile photo uploaded successfully" });
      console.log('✅ Profile photo updated successfully:', response);
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      // Revert to previous image on error
      setProfileImage(currentUser?.profileImage || '/placeholder.svg');
      // Clean up the temporary URL
      URL.revokeObjectURL(tempUrl);
      
      toast({ title: "Error", description: "Failed to upload profile photo. Please try again.", variant: "destructive" });
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'sitter': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'vet': return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
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
        const [userProfile, userPets] = await Promise.all([
          userApi.getUserByUsername(currentUser.username),
          petApi.getUserPets(currentUser.id)
        ]);
        
        if (userProfile) {
          setFormData({
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            location: userProfile.location || '',
            bio: userProfile.bio || '',
            role: userProfile.role?.toLowerCase() || 'owner',
            services: userProfile.services || '',
            capacity: userProfile.capacity || '',
            rate: userProfile.rate || '',
            specialty: userProfile.specialty || '',
            license: userProfile.license || '',
            availability: userProfile.availability || ''
          });
        }
        
        setPets(userPets || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({ title: "Error", description: "Failed to load profile data", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-12 w-12 text-indigo-600 mb-4" />
          <p className="text-lg font-medium text-gray-600">Loading your awesome profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-50 to-purple-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <Button onClick={() => navigate('/signin')} className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange('role', value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Pet Owner</SelectItem>
                <SelectItem value="sitter">Pet Sitter</SelectItem>
                <SelectItem value="vet">Veterinarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex gap-4">
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
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
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Vaccinated
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {pet.gender}
                  </Badge>
                  {pet.isAvailableForMatch && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      Available for Match
                    </Badge>
                  )}
                  {pet.isAvailableForBoarding && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      Available for Boarding
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const progress = stat.id === 'rating' ? (parseFloat(stat.value) / stat.max) * 100 : 
                          stat.id === 'response' ? parseFloat(stat.value) : 
                          (parseInt(stat.value) / stat.max) * 100;
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                </div>
                
                <p className="text-gray-600 font-medium mb-3">{stat.label}</p>
                
                <Progress value={progress} className="h-2" />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements */}
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Achievements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${achievement.bgGradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                <h4 className="font-bold text-gray-800 mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'personal': return renderPersonalInfo();
      case 'pets': return renderPets();
      case 'services': return <div>Services content coming soon...</div>;
      case 'practice': return <div>Practice content coming soon...</div>;
      case 'settings': return <div>Settings content coming soon...</div>;
      default: return renderOverview();
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
          {/* Hero Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-6 py-8"
          >
            <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl">
              {/* Hero Content */}
              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Profile Image */}
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                      <AvatarImage 
                        src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}&backgroundColor=ffd93d`} 
                        alt="Profile" 
                      />
                      <AvatarFallback className="text-2xl font-bold bg-white text-indigo-600">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <motion.button
                      className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => document.getElementById('profile-image-input')?.click()}
                    >
                      <Camera size={16} />
                    </motion.button>
                    
                    {/* Hidden file input */}
                    <input
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </motion.div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.h1 
                      className="text-4xl lg:text-5xl font-bold mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentUser?.name || 'Your Profile'}
                    </motion.h1>

                    <motion.div 
                      className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className={`${getRoleBadgeStyle(formData.role)} px-4 py-2 text-sm font-medium`}>
                        <User className="w-4 h-4 mr-2" />
                        {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      </Badge>
                      
                      {formData.location && (
                        <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          {formData.location}
                        </Badge>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                      className="flex flex-wrap justify-center lg:justify-start gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`${
                          isEditing 
                            ? 'bg-white/20 hover:bg-white/30' 
                            : 'bg-white text-indigo-600 hover:bg-gray-100'
                        } transition-all duration-300`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </Button>
                      
                      <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                      
                      <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
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
      </div>
    </TooltipProvider>
  );
};

export default Profile;
