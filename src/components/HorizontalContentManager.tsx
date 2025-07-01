import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  User, 
  Heart, 
  Briefcase, 
  Stethoscope, 
  History, 
  Settings, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import PersonalInfoTab from './PersonalInfoTab';
import PetsTab from './PetsTab';
import ServicesTab from './ServicesTab';
import PracticeTab from './PracticeTab';
import SettingsTab from './SettingsTab';
import ServiceHistory from './ServiceHistory';
import { Pet } from '@/types/pet';

interface HorizontalContentManagerProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  isEditing: boolean;
  handleSaveProfile: () => void;
  pets: Pet[];
  handleAddPet: (pet: Pet) => void;
  handleEditPet: (pet: Pet) => void;
  showAddPetForm: boolean;
  setShowAddPetForm: (show: boolean) => void;
  editingPet: Pet | null;
  setEditingPet: (pet: Pet | null) => void;
}

const HorizontalContentManager = ({
  formData,
  handleInputChange,
  handleSelectChange,
  isEditing,
  handleSaveProfile,
  pets,
  handleAddPet,
  handleEditPet,
  showAddPetForm,
  setShowAddPetForm,
  editingPet,
  setEditingPet
}: HorizontalContentManagerProps) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'personal',
      title: 'Personal Info',
      subtitle: 'Your basic information',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      available: true
    },
    {
      id: 'pets',
      title: 'My Pets',
      subtitle: 'Manage your pets',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      available: formData.role === 'owner'
    },
    {
      id: 'services',
      title: 'Services',
      subtitle: 'Pet sitting services',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-600',
      available: formData.role === 'sitter'
    },
    {
      id: 'practice',
      title: 'Practice',
      subtitle: 'Veterinary information',
      icon: Stethoscope,
      color: 'from-purple-500 to-violet-600',
      available: formData.role === 'vet'
    },
    {
      id: 'history',
      title: 'History',
      subtitle: 'Service history',
      icon: History,
      color: 'from-orange-500 to-amber-600',
      available: true
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Account preferences',
      icon: Settings,
      color: 'from-gray-500 to-slate-600',
      available: true
    }
  ].filter(section => section.available);

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoTab formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} handleSaveProfile={handleSaveProfile} />;
      case 'pets':
        return <PetsTab pets={pets} handleEditPet={handleEditPet} showAddPetForm={showAddPetForm} setShowAddPetForm={setShowAddPetForm} editingPet={editingPet} setEditingPet={setEditingPet} />;
      case 'services':
        return <ServicesTab formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} handleSaveProfile={handleSaveProfile} />;
      case 'practice':
        return <PracticeTab formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} handleSaveProfile={handleSaveProfile} />;
      case 'history':
        return (
          <Card className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
            <ServiceHistory />
          </Card>
        );
      case 'settings':
        return <SettingsTab formData={formData} handleSelectChange={handleSelectChange} isEditing={isEditing} handleSaveProfile={handleSaveProfile} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Horizontal Navigation */}
      <div className="mb-8">
        <motion.div 
          className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;
            const isHovered = hoveredSection === section.id;
            
            return (
              <motion.button
                key={section.id}
                className={`relative flex-shrink-0 p-6 rounded-2xl min-w-[200px] text-left transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-2xl' 
                    : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 border border-white/30'
                }`}
                onClick={() => setActiveSection(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <motion.div
                      className="w-full h-full bg-yellow-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                )}

                {/* Sparkle effect for active */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${
                    isActive ? 'bg-white/20' : 'bg-gradient-to-r ' + section.color
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isActive ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ChevronRight className={`w-5 h-5 ${
                      isActive ? 'text-white/80' : 'text-gray-400'
                    }`} />
                  </motion.div>
                </div>

                <h3 className={`text-lg font-bold mb-1 ${
                  isActive ? 'text-white' : 'text-gray-800'
                }`}>
                  {section.title}
                </h3>
                
                <p className={`text-sm ${
                  isActive ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {section.subtitle}
                </p>

                {/* Hover effect */}
                {isHovered && !isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button */}
      {isEditing && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.button
            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveProfile}
          >
            <Zap className="w-6 h-6" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default HorizontalContentManager;
