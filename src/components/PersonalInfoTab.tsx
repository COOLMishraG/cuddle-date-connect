import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfoTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isEditing: boolean;
  handleSaveProfile: () => void;
}

const PersonalInfoTab = ({ 
  formData, 
  handleInputChange, 
  isEditing, 
  handleSaveProfile 
}: PersonalInfoTabProps) => {
  return (
    <Card className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">Manage your basic profile information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Your Name"
            className={`transition-all duration-300 ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            }`}
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="your.email@example.com"
            className={`transition-all duration-300 ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            }`}
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Your Phone"
            className={`transition-all duration-300 ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            }`}
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
            Location
          </label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="City, Country"
            className={`transition-all duration-300 ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            }`}
          />
        </div>
        
        <div className="space-y-3 md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-gray-700">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
            className={`transition-all duration-300 resize-none ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            }`}
            rows={4}
          />
        </div>
      </div>
      
      {isEditing && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PersonalInfoTab;
