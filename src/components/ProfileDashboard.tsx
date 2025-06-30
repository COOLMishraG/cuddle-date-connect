import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  User, 
  Star, 
  Heart, 
  TrendingUp, 
  Award, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Share2,
  Settings,
  Camera,
  Trophy,
  Zap,
  Target,
  Activity,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { userApi } from '@/services/api';
import { uploadImageToCloudinary } from '@/services/cloudinary';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileDashboardProps {
  currentUser: any;
  profileImage: string;
  formData: any;
  isEditing: boolean;
  onEditToggle: () => void;
  onSignOut: () => void;
  pets: any[];
  onSectionChange: (section: string) => void;
  onProfileImageChange: (imageUrl: string) => void;
}

const ProfileDashboard = ({
  currentUser,
  profileImage,
  formData,
  isEditing,
  onEditToggle,
  onSignOut,
  pets,
  onSectionChange,
  onProfileImageChange
}: ProfileDashboardProps) => {
  const { refreshUserData } = useAuth();
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for immediate preview
    const tempUrl = URL.createObjectURL(file);
    onProfileImageChange(tempUrl);

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
      onProfileImageChange(cloudinaryURI);
      
      // Step 3: Refresh user data in AuthContext to ensure latest profile data
      console.log('🔄 Refreshing user data in context...');
      await refreshUserData();
      
      // Clean up the temporary URL
      URL.revokeObjectURL(tempUrl);
      
      console.log('✅ Profile photo updated successfully:', response);
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      // Revert to previous image on error
      onProfileImageChange(profileImage);
      // Clean up the temporary URL
      URL.revokeObjectURL(tempUrl);
      
      // You could show a toast notification here
      alert('Failed to upload profile photo. Please try again.');
    }
  };

  // Simplified key stats
  const keyStats = [
    { id: 'rating', label: 'Rating', value: '4.9', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { id: 'bookings', label: 'Total Bookings', value: '127', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-100' }
  ];

  // Interactive widgets for the profile landing
  const profileWidgets = [
    {
      id: 'pets',
      title: 'My Pets',
      count: pets?.length || 0,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      preview: pets?.slice(0, 2) || [],
      onClick: () => onSectionChange('pets')
    },
    {
      id: 'services',
      title: 'Services',
      count: formData.role === 'sitter' ? 3 : formData.role === 'vet' ? 5 : 2,
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      preview: formData.role === 'sitter' ? ['Pet Sitting', 'Dog Walking'] : 
               formData.role === 'vet' ? ['Health Checkups', 'Vaccinations'] : 
               ['Pet Care', 'General Services'],
      onClick: () => onSectionChange('services')
    },
    {
      id: 'activity',
      title: 'Recent Activity',
      count: 12,
      icon: Activity,
      color: 'from-purple-500 to-violet-500',
      preview: ['Completed sitting for Max', 'Vet appointment scheduled'],
      onClick: () => onSectionChange('overview')
    }
  ];

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'sitter': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'vet': return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Hero Profile Section - Horizontal Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image & Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
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

                {/* Online Status */}
                <motion.div 
                  className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
                  animate={{ 
                    boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 10px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online Now</span>
                </motion.div>
              </div>

              {/* Main Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h1 
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {formData.name || currentUser?.name || 'Your Profile'}
                </motion.h1>

                <motion.div 
                  className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4"
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

                {formData.bio && (
                  <motion.p 
                    className="text-lg opacity-90 max-w-2xl mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {formData.bio}
                  </motion.p>
                )}

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-wrap justify-center lg:justify-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={onEditToggle}
                    className={`${
                      isEditing 
                        ? 'bg-white/20 hover:bg-white/30' 
                        : 'bg-white text-indigo-600 hover:bg-gray-100'
                    } transition-all duration-300`}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
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

      {/* Key Stats & Interactive Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Key Stats
            </h3>
            
            <div className="space-y-4">
              {keyStats.map((stat, index) => {
                const IconComponent = stat.icon;
                
                return (
                  <motion.div
                    key={stat.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Interactive Profile Widgets */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Quick Access
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profileWidgets.map((widget, index) => {
                const IconComponent = widget.icon;
                
                return (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={widget.onClick}
                    className="cursor-pointer"
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${widget.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">{widget.count}</div>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-lg text-gray-800 mb-3">{widget.title}</h4>
                      
                      {/* Widget Preview Content */}
                      <div className="space-y-2">
                        {widget.id === 'pets' && pets && pets.length > 0 ? (
                          <>
                            {pets.slice(0, 2).map((pet, petIndex) => (
                              <div key={petIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                  {pet.name?.charAt(0) || 'P'}
                                </div>
                                <span>{pet.name}</span>
                              </div>
                            ))}
                            {pets.length > 2 && (
                              <div className="text-xs text-gray-500">+{pets.length - 2} more pets</div>
                            )}
                          </>
                        ) : widget.id === 'pets' ? (
                          <div className="text-sm text-gray-500">No pets added yet</div>
                        ) : (
                          <>
                            {widget.preview.slice(0, 2).map((item, itemIndex) => (
                              <div key={itemIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                <span>{item}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      
                      <motion.div 
                        className="mt-4 text-sm font-medium text-gray-500 flex items-center gap-1"
                        whileHover={{ x: 5 }}
                      >
                        View all <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="p-6 bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-lg border-0 shadow-xl">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              {formData.email && (
                <motion.div 
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{formData.email}</span>
                </motion.div>
              )}
              
              {formData.phone && (
                <motion.div 
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{formData.phone}</span>
                </motion.div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Member since January 2024 • Last active 2 hours ago
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileDashboard;
