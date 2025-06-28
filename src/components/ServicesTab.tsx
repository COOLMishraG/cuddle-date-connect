import { Save, DollarSign, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ServicesTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isEditing: boolean;
  handleSaveProfile: () => void;
}

const ServicesTab = ({ 
  formData, 
  handleInputChange, 
  isEditing, 
  handleSaveProfile 
}: ServicesTabProps) => {
  return (
    <Card className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Pet Sitting Services
        </h2>
        <p className="text-gray-600">Configure your pet sitting offerings and availability</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="services" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users className="w-4 h-4" />
            Services Offered
          </label>
          <Textarea
            id="services"
            name="services"
            value={formData.services}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Describe the services you offer (dog walking, overnight care, grooming, etc.)..."
            className={`transition-all duration-300 resize-none ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200"
            }`}
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label htmlFor="capacity" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="w-4 h-4" />
              Pet Capacity
            </label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Number of pets you can host"
              className={`transition-all duration-300 ${
                !isEditing 
                  ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                  : "bg-white/70 backdrop-blur-sm border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200"
              }`}
            />
          </div>
          
          <div className="space-y-3">
            <label htmlFor="rate" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DollarSign className="w-4 h-4" />
              Daily Rate
            </label>
            <Input
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Your daily rate (e.g., $50/day)"
              className={`transition-all duration-300 ${
                !isEditing 
                  ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                  : "bg-white/70 backdrop-blur-sm border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200"
              }`}
            />
          </div>
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
            placeholder="Describe your availability (weekdays, weekends, holidays, etc.)..."
            className={`transition-all duration-300 resize-none ${
              !isEditing 
                ? "bg-gray-50/70 backdrop-blur-sm border-gray-200/50" 
                : "bg-white/70 backdrop-blur-sm border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200"
            }`}
            rows={3}
          />
        </div>

        {/* Service Highlights */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Service Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-medium text-green-800">Capacity</p>
              <p className="text-sm text-green-600">{formData.capacity || 'Not set'} pets</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-medium text-green-800">Rate</p>
              <p className="text-sm text-green-600">{formData.rate || 'Not set'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-medium text-green-800">Available</p>
              <p className="text-sm text-green-600">View full schedule</p>
            </div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ServicesTab;
