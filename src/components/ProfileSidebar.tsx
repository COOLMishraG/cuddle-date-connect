import { Edit2, LogOut, Share2, Star, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileSidebarProps {
  currentUser: any;
  profileImage: string;
  formData: any;
  isEditing: boolean;
  onEditToggle: () => void;
  onSignOut: () => void;
}

const ProfileSidebar = ({ 
  currentUser, 
  profileImage, 
  formData, 
  isEditing, 
  onEditToggle, 
  onSignOut 
}: ProfileSidebarProps) => {
  
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'sitter': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'vet': return 'bg-gradient-to-r from-purple-500 to-violet-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  return (
    <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg p-8 sticky top-8">
      {/* Profile Image and Basic Info */}
      <div className="text-center mb-8">
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
            <img 
              src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}&backgroundColor=ffd93d`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Online Status */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {currentUser?.name || 'Your Profile'}
        </h1>
        
        <Badge className={`${getRoleBadgeColor(formData.role)} text-white px-4 py-2 text-sm font-medium mb-4`}>
          {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </Badge>
        
        {formData.location && (
          <p className="text-gray-600 text-sm mb-4">{formData.location}</p>
        )}
        
        {formData.bio && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
            {formData.bio}
          </p>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-indigo-600">4.9</div>
          <div className="flex items-center justify-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-600">Rating</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-purple-600">127</div>
          <div className="flex items-center justify-center gap-1">
            <Users className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">Reviews</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-pink-600">2.5K</div>
          <div className="flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">Bookings</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={onEditToggle}
          className={`w-full transition-all duration-300 ${
            isEditing 
              ? 'bg-gray-500 hover:bg-gray-600 text-white' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
          }`}
        >
          <Edit2 size={16} className="mr-2" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full glass-card border-0 bg-white/30 hover:bg-white/40 text-gray-700 transition-all duration-300 hover:scale-105"
        >
          <Share2 size={16} className="mr-2" />
          Share Profile
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full glass-card border-0 bg-red-50/50 hover:bg-red-100/50 text-red-600 transition-all duration-300"
          onClick={onSignOut}
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
      
      {/* Quick Info */}
      <div className="mt-8 pt-6 border-t border-white/30">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Member since</span>
            <span className="font-medium">Jan 2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Response time</span>
            <span className="font-medium text-green-600">~1 hour</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Verified</span>
            <span className="font-medium text-blue-600">✓ Email</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
