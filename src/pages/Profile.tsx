import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import AddPetForm from '@/components/AddPetForm';
import useAuthGuard from '@/hooks/useAuthGuard';
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
  };

  const handleSaveProfile = async () => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      const userData = {
        ...formData,
        // Convert role to uppercase to match backend enum
        role: formData.role.toUpperCase(),
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Heart size={40} className="text-indigo-600 mx-auto" />
          </div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If we have a user but no ID, show an error
  if (currentUser && !currentUser.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: Invalid user data. Please try signing in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Modern Profile Header */}
        <div className="mb-12 pt-8">
          <ProfileHeader 
            currentUser={currentUser}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            formData={formData}
            onEditToggle={() => setIsEditing(!isEditing)}
            isEditing={isEditing}
          />
        </div>
        
        {/* Profile Content with Tabs */}
        <div className="max-w-5xl mx-auto">
          <ProfileTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            isEditing={isEditing}
            handleSaveProfile={handleSaveProfile}
            pets={pets}
            handleAddPet={handleAddPet}
            handleEditPet={handleEditPet}
            showAddPetForm={showAddPetForm}
            setShowAddPetForm={setShowAddPetForm}
            editingPet={editingPet}
            setEditingPet={setEditingPet}
          />
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
