import { useState, useRef } from 'react';
import { Camera, Edit2, MapPin, User, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { uploadImageToCloudinary, validateImageFile } from '@/services/cloudinary';
import { userApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface ProfileHeaderProps {
  currentUser: any;
  profileImage: string;
  setProfileImage: (url: string) => void;
  formData: any;
  onEditToggle: () => void;
  isEditing: boolean;
}

const ProfileHeader = ({ 
  currentUser, 
  profileImage, 
  setProfileImage, 
  formData, 
  onEditToggle, 
  isEditing 
}: ProfileHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationResult = validateImageFile(file);
    if (!validationResult.isValid) {
      toast({
        title: "Upload Failed",
        description: validationResult.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      if (!currentUser?.username) {
        throw new Error('User not authenticated or username is missing');
      }

      const imageUrl = await uploadImageToCloudinary(file, 'user_profiles');
      if (!imageUrl) {
        throw new Error('Image upload failed, no URL returned.');
      }

      await userApi.updateUserByUsername(currentUser.username, { profileImage: imageUrl });
      setProfileImage(imageUrl);

      toast({
        title: "Profile photo updated",
        description: "Your new photo has been saved.",
      });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      setProfileImage(currentUser?.profileImage || '/placeholder.svg');
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

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'sitter': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'vet': return 'bg-gradient-to-r from-purple-500 to-violet-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  return (
    <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg p-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Profile Image Section */}
        <div className="relative">
          <div className="relative w-32 h-32 lg:w-40 lg:h-40">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
              <img 
                src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}&backgroundColor=ffd93d`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <button 
              className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
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
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {currentUser?.name || 'Your Profile'}
            </h1>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
              <Badge className={`${getRoleBadgeColor(formData.role)} text-white px-4 py-2 text-sm font-medium`}>
                <User className="w-4 h-4 mr-2" />
                {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </Badge>
              
              {formData.location && (
                <Badge variant="outline" className="bg-white/50 backdrop-blur-sm px-4 py-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {formData.location}
                </Badge>
              )}
            </div>
            
            {formData.bio && (
              <p className="text-gray-600 max-w-2xl leading-relaxed mb-4">
                {formData.bio}
              </p>
            )}
            
            {/* Stats Row */}
            <div className="flex justify-center lg:justify-start gap-6 text-sm text-gray-600 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">4.9</div>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">127</div>
                <div>Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">2.5K</div>
                <div>Connections</div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Button 
              onClick={onEditToggle}
              className={`${
                isEditing 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
            
            <Button 
              variant="outline"
              className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 transition-all duration-300"
            >
              Share Profile
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
