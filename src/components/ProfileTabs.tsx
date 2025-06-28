import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalInfoTab from './PersonalInfoTab';
import PetsTab from './PetsTab';
import ServicesTab from './ServicesTab';
import PracticeTab from './PracticeTab';
import SettingsTab from './SettingsTab';
import ServiceHistory from './ServiceHistory';
import { Pet } from '@/types/pet';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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

const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
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
}: ProfileTabsProps) => {
  
  const getVisibleTabs = () => {
    const baseTabs = ['personal', 'history', 'settings'];
    
    if (formData.role === 'owner') {
      return ['personal', 'pets', 'history', 'settings'];
    } else if (formData.role === 'sitter') {
      return ['personal', 'services', 'history', 'settings'];
    } else if (formData.role === 'vet') {
      return ['personal', 'practice', 'history', 'settings'];
    }
    
    return baseTabs;
  };

  const visibleTabs = getVisibleTabs();

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
        {visibleTabs.map((tab) => (
          <TabsTrigger 
            key={tab}
            value={tab} 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-white/20"
          >
            {tab === 'personal' && 'Personal Info'}
            {tab === 'pets' && 'My Pets'}
            {tab === 'services' && 'Services'}
            {tab === 'practice' && 'Practice'}
            {tab === 'history' && 'History'}
            {tab === 'settings' && 'Settings'}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="personal">
        <PersonalInfoTab 
          formData={formData}
          handleInputChange={handleInputChange}
          isEditing={isEditing}
          handleSaveProfile={handleSaveProfile}
        />
      </TabsContent>
      
      {formData.role === 'owner' && (
        <TabsContent value="pets">
          <PetsTab 
            pets={pets}
            handleEditPet={handleEditPet}
            showAddPetForm={showAddPetForm}
            setShowAddPetForm={setShowAddPetForm}
            editingPet={editingPet}
            setEditingPet={setEditingPet}
          />
        </TabsContent>
      )}
      
      {formData.role === 'sitter' && (
        <TabsContent value="services">
          <ServicesTab 
            formData={formData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
            handleSaveProfile={handleSaveProfile}
          />
        </TabsContent>
      )}
      
      {formData.role === 'vet' && (
        <TabsContent value="practice">
          <PracticeTab 
            formData={formData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
            handleSaveProfile={handleSaveProfile}
          />
        </TabsContent>
      )}
      
      <TabsContent value="history">
        <div className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
          <ServiceHistory />
        </div>
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab 
          formData={formData}
          handleSelectChange={handleSelectChange}
          isEditing={isEditing}
          handleSaveProfile={handleSaveProfile}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
