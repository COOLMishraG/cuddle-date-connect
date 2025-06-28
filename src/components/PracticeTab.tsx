import { Save, Stethoscope, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PracticeTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isEditing: boolean;
  handleSaveProfile: () => void;
}

const PracticeTab = ({ 
  formData, 
  handleInputChange, 
  isEditing, 
  handleSaveProfile 
}: PracticeTabProps) => {
  return (
    <Card className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
          Veterinary Practice
        </h2>
        <p className="text-gray-600">Manage your professional practice information</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="specialty" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Stethoscope className="w-4 h-4" />
            Specialty
          </label>
          <Input
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Your veterinary specialty (e.g., Small Animals, Exotic Pets, Surgery)"
            className={`transition-all duration-300 ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            }`}
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="license" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Award className="w-4 h-4" />
            License Number
          </label>
          <Input
            id="license"
            name="license"
            value={formData.license}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Your professional license number"
            className={`transition-all duration-300 ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            }`}
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="availability" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="w-4 h-4" />
            Availability
          </label>
          <Textarea
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Describe your availability and practice hours..."
            className={`transition-all duration-300 resize-none ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            }`}
            rows={3}
          />
        </div>

        {/* Practice Highlights */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">Practice Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="w-6 h-6 text-purple-600" />
              </div>
              <p className="font-medium text-purple-800">Specialty</p>
              <p className="text-sm text-purple-600">{formData.specialty || 'Not specified'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <p className="font-medium text-purple-800">Licensed</p>
              <p className="text-sm text-purple-600">{formData.license ? 'Verified' : 'Pending'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <p className="font-medium text-purple-800">Availability</p>
              <p className="text-sm text-purple-600">Check schedule</p>
            </div>
          </div>
        </div>

        {/* Professional Services */}
        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/40">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Health Checkups</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Vaccinations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Emergency Care</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Surgery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Dental Care</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Lab Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Grooming</span>
            </div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PracticeTab;
