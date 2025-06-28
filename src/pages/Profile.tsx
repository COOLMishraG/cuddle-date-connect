import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, User, MapPin, Phone, Mail, Calendar, Plus, Edit2, Camera, Save, Trash2, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import useAuthGuard from '@/hooks/useAuthGuard';
import ServiceHistory from '@/components/ServiceHistory';
import AddPetForm from '@/components/AddPetForm';
import { toast } from '@/hooks/use-toast';
import { userApi, petApi } from '@/services/api';
import { Pet } from '@/types/pet';
import { UserRole } from '@/types/user';

const Profile = () => {  
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const [activeTab, setActiveTab] = useState('personal');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '/placeholder.svg');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };  const handleSaveProfile = async () => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      const userData = {
        ...formData,
        // Convert role to uppercase to match backend enum
        role: formData.role.toUpperCase(),
        // If profileImage is a base64 string, we'll let the dedicated upload function handle it
      };
      
      // Update user in the backend
      await userApi.updateUser(currentUser.id, userData);
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error saving your profile.",
        variant: "destructive"
      });
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };
    const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File validation
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or GIF image.",
        variant: "destructive"
      });
      return;
    }

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      // First, show a preview of the image immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
      
      // Then upload to backend
      const result = await userApi.uploadProfilePhoto(currentUser.id, file);
      
      // Update the profile image with the URL from the server
      if (result.profileImage) {
        setProfileImage(result.profileImage);
      }
      
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error uploading your photo.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
    const handleAddPet = async (pet: Pet) => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      let result;
      
      if (editingPet) {
        // Update existing pet in the backend
        result = await petApi.updatePet(pet.id, {
          ...pet,
          userId: currentUser.id
        });
        
        // Update the local state
        setPets(pets.map(p => p.id === pet.id ? result : p));
        setEditingPet(null);
      } else {
        // Add new pet to the backend
        result = await petApi.createPet({
          ...pet,
          userId: currentUser.id
        }, currentUser.username);
        
        // Update the local state with the response from the backend
        setPets([...pets, result]);
      }
      
      setShowAddPetForm(false);
      
      toast({
        title: editingPet ? "Pet updated" : "Pet added",
        description: `Your pet has been ${editingPet ? 'updated' : 'added'} successfully.`,
      });
    } catch (error) {
      console.error('Error saving pet:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error saving pet information.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setShowAddPetForm(true);
  };
  // Load user data and pets when the component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser?.id) {
        console.log('No current user ID found');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Loading user data for:', currentUser.username || currentUser.email);
        
        // First, set up basic form data with current user info
        const basicFormData = {
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          location: currentUser.location || '',
          bio: '',
          role: (currentUser.role || 'OWNER').toLowerCase(),
          services: '',
          capacity: '',
          rate: '',
          specialty: '',
          license: '',
          availability: ''
        };
        
        setFormData(basicFormData);
        
        // Set profile image from current user
        if (currentUser.profileImage) {
          setProfileImage(currentUser.profileImage);
        }
        
        // Try to load extended user profile data (optional)
        try {
          console.log('Attempting to fetch extended profile data...');
          const userProfile = await userApi.getUserProfile(currentUser.id);
          console.log('Extended profile data loaded:', userProfile);
          
          // Update form data with extended profile data if available
          setFormData({
            name: userProfile.name || currentUser.name || '',
            email: userProfile.email || currentUser.email || '',
            phone: userProfile.phone || currentUser.phone || '',
            location: userProfile.location || currentUser.location || '',
            bio: userProfile.bio || '',
            role: (userProfile.role || currentUser.role || 'OWNER').toLowerCase(),
            services: userProfile.services || '',
            capacity: userProfile.capacity || '',
            rate: userProfile.rate || '',
            specialty: userProfile.specialty || '',
            license: userProfile.license || '',
            availability: userProfile.availability || ''
          });
          
          // Update profile image if available
          if (userProfile.profileImage) {
            setProfileImage(userProfile.profileImage);
          }
        } catch (profileError) {
          console.warn('Could not load extended profile data:', profileError);
          // Continue with basic user data - this is not a critical error
        }
        
        // Try to load user's pets (optional)
        try {
          console.log('Attempting to fetch user pets...');
          const userPets = await petApi.getUserPets(currentUser.username);
          console.log('User pets loaded:', userPets);
          setPets(userPets || []);
        } catch (petsError) {
          console.warn('Could not load user pets:', petsError);
          setPets([]); // Set empty array as fallback
        }
        
      } catch (error) {
        console.error('Error in loadUserData:', error);
        // Don't show error toast for newly registered users - just log and continue
        console.warn('Profile loading encountered an error, but continuing with basic user data');
      } finally {
        setIsLoading(false);
        console.log('Profile loading completed');
      }
    };
    
    loadUserData();
  }, [currentUser?.id]);

  // Loading state - only show loading if we don't have a current user or if we're explicitly loading
  if ((isLoading && !currentUser) || authLoading) {
    return (
      <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Heart size={40} className="text-burgundy mx-auto" />
          </div>
          <p className="mt-4 text-deep-rose">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If we have a user but no ID, show an error
  if (currentUser && !currentUser.id) {
    return (
      <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-deep-rose">Error: Invalid user data. Please try signing in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes - Enhanced with more emojis */}
      <div className="floating-shape absolute top-[7%] left-[15%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[18%] right-[12%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[15%] left-[10%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[35%] left-[25%] text-2xl float-1" style={{ animationDelay: '2s' }}>🏠</div>
      <div className="floating-shape absolute bottom-[30%] right-[20%] text-3xl float-2" style={{ animationDelay: '3s' }}>🩺</div>
      <div className="floating-shape absolute top-[50%] right-[5%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[5%] left-[40%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐕</div>
      
      {/* Additional floating emojis */}
      <div className="floating-shape absolute top-[12%] left-[65%] text-3xl float-2" style={{ animationDelay: '1.5s' }}>🐱</div>
      <div className="floating-shape absolute top-[60%] left-[18%] text-2xl float-3" style={{ animationDelay: '2.5s' }}>🦴</div>
      <div className="floating-shape absolute bottom-[40%] left-[75%] text-4xl float-1" style={{ animationDelay: '3.5s' }}>🎾</div>
      <div className="floating-shape absolute top-[75%] right-[45%] text-3xl float-2" style={{ animationDelay: '0.5s' }}>🐕‍🦺</div>
      <div className="floating-shape absolute top-[28%] left-[55%] text-2xl float-3" style={{ animationDelay: '4.5s' }}>🦮</div>
      <div className="floating-shape absolute bottom-[60%] right-[15%] text-5xl float-1" style={{ animationDelay: '1.8s' }}>💙</div>
      <div className="floating-shape absolute top-[85%] left-[28%] text-3xl float-2" style={{ animationDelay: '3.2s' }}>🐾</div>
      <div className="floating-shape absolute bottom-[8%] right-[60%] text-2xl float-3" style={{ animationDelay: '2.8s' }}>🍖</div>
      <div className="floating-shape absolute top-[22%] left-[42%] text-4xl float-1" style={{ animationDelay: '4.2s' }}>🧸</div>
      <div className="floating-shape absolute bottom-[25%] left-[32%] text-3xl float-2" style={{ animationDelay: '0.8s' }}>🎈</div>
      <div className="floating-shape absolute top-[65%] right-[35%] text-2xl float-3" style={{ animationDelay: '3.8s' }}>🏆</div>
      <div className="floating-shape absolute bottom-[45%] left-[58%] text-4xl float-1" style={{ animationDelay: '1.2s' }}>🌟</div>
      <div className="floating-shape absolute top-[80%] left-[78%] text-3xl float-2" style={{ animationDelay: '4.8s' }}>🦊</div>
      <div className="floating-shape absolute top-[5%] left-[35%] text-2xl float-3" style={{ animationDelay: '2.2s' }}>🐰</div>
      <div className="floating-shape absolute bottom-[20%] right-[8%] text-4xl float-1" style={{ animationDelay: '3.7s' }}>🐈‍⬛</div>
      <div className="floating-shape absolute top-[45%] left-[8%] text-3xl float-2" style={{ animationDelay: '1.9s' }}>🌸</div>
      <div className="floating-shape absolute bottom-[55%] right-[65%] text-2xl float-3" style={{ animationDelay: '4.3s' }}>🐦</div>
      <div className="floating-shape absolute top-[90%] left-[50%] text-4xl float-1" style={{ animationDelay: '0.3s' }}>💜</div>
      <div className="floating-shape absolute top-[15%] right-[70%] text-3xl float-2" style={{ animationDelay: '2.7s' }}>🌺</div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="romantic-card-accent p-6 rounded-xl shadow-md">              <div className="text-center mb-6">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <div className="w-32 h-32 bg-rose rounded-full overflow-hidden border-4 border-blush-pink">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <button 
                    className="absolute bottom-0 right-0 bg-burgundy text-white p-2 rounded-full shadow-md hover:bg-deep-rose transition-colors"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    aria-label="Change profile photo"
                  >
                    <Camera size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleProfilePhotoUpload}
                    className="hidden" 
                    accept="image/jpeg, image/png, image/jpg, image/gif" 
                  />
                </div>
                
                <h1 className="text-2xl font-bold fredoka text-burgundy">
                  {currentUser?.name || 'Your Profile'}
                </h1>
                <p className="text-deep-rose flex items-center justify-center gap-1 mt-1">
                  <User size={14} />
                  {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </p>
                
                {formData.location && (
                  <p className="text-gray-600 flex items-center justify-center gap-1 mt-2">
                    <MapPin size={14} />
                    {formData.location}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 size={16} className="mr-2" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  <Trash2 size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main Profile Content */}
          <div className="w-full md:w-2/3">
            <Card className="romantic-card-accent p-6 rounded-xl shadow-md">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
                    Personal Info
                  </TabsTrigger>
                  
                  {formData.role === 'owner' && (
                    <TabsTrigger value="pets" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
                      My Pets
                    </TabsTrigger>
                  )}
                  
                  {formData.role === 'sitter' && (
                    <TabsTrigger value="services" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
                      Services
                    </TabsTrigger>
                  )}
                  
                  {formData.role === 'vet' && (
                    <TabsTrigger value="practice" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
                      Practice
                    </TabsTrigger>
                  )}
                  
                  <TabsTrigger value="history" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
                    History
                  </TabsTrigger>
                  
                  <TabsTrigger value="settings" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-4">
                  <h2 className="text-xl font-bold text-burgundy">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Your Name"
                        className={!isEditing ? "bg-lavender/30" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="your.email@example.com"
                        className={!isEditing ? "bg-lavender/30" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Your Phone"
                        className={!isEditing ? "bg-lavender/30" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-medium">Location</label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="City, Country"
                        className={!isEditing ? "bg-lavender/30" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        className={!isEditing ? "bg-lavender/30" : ""}
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-burgundy hover:bg-deep-rose text-white"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Pets Tab (for Owner role) */}
                <TabsContent value="pets" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-burgundy">My Pets</h2>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setEditingPet(null);
                        setShowAddPetForm(true);
                      }}
                      className="bg-burgundy hover:bg-deep-rose text-white"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Pet
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {pets.map(pet => (
                      <Card key={pet.id} className="overflow-hidden border border-rose">
                        <div className="relative h-40 bg-gray-100">
                          <img 
                            src={pet.imageUrl  || '/placeholder.svg'} 
                            alt={pet.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          <button 
                            className="absolute top-2 right-2 bg-burgundy/80 hover:bg-burgundy text-white p-1.5 rounded-full"
                            onClick={() => handleEditPet(pet)}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-burgundy">{pet.name}</h3>
                          <div className="text-sm text-gray-600 space-y-1 mt-1">
                            <p>{pet.breed} • {pet.age} years • {pet.gender}</p>
                            <p className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${pet.vaccinated ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {pet.vaccinated ? 'Vaccinated' : 'Not vaccinated'}
                            </p>
                            <p className="line-clamp-2 mt-2 text-gray-700">{pet.description}</p>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                              onClick={() => handleEditPet(pet)}
                            >
                              Edit Profile
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs border-rose text-rose hover:bg-rose hover:text-white"
                              onClick={() => navigate('/breeding')}
                            >
                              Find Matches
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Services Tab (for Sitter role) */}
                <TabsContent value="services" className="space-y-4">
                  <h2 className="text-xl font-bold text-burgundy">My Services</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="services" className="block text-sm font-medium">Services Offered</label>
                      <Textarea
                        id="services"
                        name="services"
                        value={formData.services}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Describe the services you offer..."
                        className={!isEditing ? "bg-lavender/30" : ""}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Number of pets you can host"
                          className={!isEditing ? "bg-lavender/30" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="rate" className="block text-sm font-medium">Rate (per day)</label>
                        <Input
                          id="rate"
                          name="rate"
                          value={formData.rate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Your daily rate"
                          className={!isEditing ? "bg-lavender/30" : ""}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
                      <Textarea
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Describe your availability..."
                        className={!isEditing ? "bg-lavender/30" : ""}
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-burgundy hover:bg-deep-rose text-white"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Practice Tab (for Vet role) */}
                <TabsContent value="practice" className="space-y-4">
                  <h2 className="text-xl font-bold text-burgundy">Practice Information</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="specialty" className="block text-sm font-medium">Specialty</label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Your veterinary specialty"
                        className={!isEditing ? "bg-lavender/30" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="license" className="block text-sm font-medium">License Number</label>
                      <Input
                        id="license"
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Your license number"
                        className={!isEditing ? "bg-lavender/30" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
                      <Textarea
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Describe your availability..."
                        className={!isEditing ? "bg-lavender/30" : ""}
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-burgundy hover:bg-deep-rose text-white"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* History Tab (Service History) */}
                <TabsContent value="history" className="space-y-4">
                  <ServiceHistory />
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <h2 className="text-xl font-bold text-burgundy">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-medium">User Role</label>
                      <Select 
                        disabled={!isEditing}
                        value={formData.role}
                        onValueChange={(value) => handleSelectChange('role', value)}
                      >
                        <SelectTrigger className={!isEditing ? "bg-lavender/30" : ""}>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Pet Owner</SelectItem>
                          <SelectItem value="sitter">Pet Sitter</SelectItem>
                          <SelectItem value="vet">Veterinarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Notification Settings</h3>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                        />
                        <label htmlFor="emailNotifications" className="text-sm">
                          Receive email notifications
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                        />
                        <label htmlFor="pushNotifications" className="text-sm">
                          Receive push notifications
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Privacy Settings</h3>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="profilePublic"
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                        />
                        <label htmlFor="profilePublic" className="text-sm">
                          Make my profile public
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="shareLocation"
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                        />
                        <label htmlFor="shareLocation" className="text-sm">
                          Share my approximate location
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-burgundy hover:bg-deep-rose text-white"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Pet Form Dialog */}
      <AddPetForm 
        open={showAddPetForm} 
        onClose={() => setShowAddPetForm(false)} 
        onPetAdded={handleAddPet} 
        existingPet={editingPet}
      />
    </div>
  );
};

export default Profile;
