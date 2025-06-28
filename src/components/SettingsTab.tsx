import { Save, User, Bell, Shield, Smartphone, Mail, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface SettingsTabProps {
  formData: any;
  handleSelectChange: (name: string, value: string) => void;
  isEditing: boolean;
  handleSaveProfile: () => void;
}

const SettingsTab = ({ 
  formData, 
  handleSelectChange, 
  isEditing, 
  handleSaveProfile 
}: SettingsTabProps) => {
  return (
    <Card className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-2">
          Account Settings
        </h2>
        <p className="text-gray-600">Manage your account preferences and privacy settings</p>
      </div>
      
      <div className="space-y-8">
        {/* User Role */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">User Role</h3>
          </div>
          <div className="space-y-3">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <Select 
              disabled={!isEditing}
              value={formData.role}
              onValueChange={(value) => handleSelectChange('role', value)}
            >
              <SelectTrigger className={`transition-all duration-300 ${
                !isEditing 
                  ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                  : "bg-white/70 backdrop-blur-sm border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              }`}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Pet Owner</SelectItem>
                <SelectItem value="sitter">Pet Sitter</SelectItem>
                <SelectItem value="vet">Veterinarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
              </div>
              <Switch disabled={!isEditing} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications on your device</p>
                </div>
              </div>
              <Switch disabled={!isEditing} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Marketing Communications</p>
                  <p className="text-sm text-gray-600">Receive promotional content</p>
                </div>
              </div>
              <Switch disabled={!isEditing} />
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Privacy & Security</h3>
          </div>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Public Profile</p>
                  <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                </div>
              </div>
              <Switch disabled={!isEditing} defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Share Location</p>
                  <p className="text-sm text-gray-600">Share your approximate location with others</p>
                </div>
              </div>
              <Switch disabled={!isEditing} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Show Online Status</p>
                  <p className="text-sm text-gray-600">Let others see when you're online</p>
                </div>
              </div>
              <Switch disabled={!isEditing} defaultChecked />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Account Actions</h3>
          
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Download My Data</p>
                <p className="text-sm text-gray-600">Get a copy of your account data</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/50 border-gray-200 hover:bg-white/70"
                disabled={!isEditing}
              >
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Deactivate Account</p>
                <p className="text-sm text-gray-600">Temporarily disable your account</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                disabled={!isEditing}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SettingsTab;
