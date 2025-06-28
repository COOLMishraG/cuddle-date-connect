import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pet } from '@/types/pet';

interface PetsTabProps {
  pets: Pet[];
  handleEditPet: (pet: Pet) => void;
  showAddPetForm: boolean;
  setShowAddPetForm: (show: boolean) => void;
  editingPet: Pet | null;
  setEditingPet: (pet: Pet | null) => void;
}

const PetsTab = ({ 
  pets, 
  handleEditPet, 
  setShowAddPetForm, 
  setEditingPet 
}: PetsTabProps) => {
  const navigate = useNavigate();

  return (
    <Card className="glass-card bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Pets
          </h2>
          <p className="text-gray-600">Manage your furry family members</p>
        </div>
        <Button 
          onClick={() => {
            setEditingPet(null);
            setShowAddPetForm(true);
          }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus size={16} className="mr-2" />
          Add New Pet
        </Button>
      </div>
      
      {pets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets yet</h3>
          <p className="text-gray-500 mb-6">Add your first pet to get started with CuddleDateConnect</p>
          <Button 
            onClick={() => {
              setEditingPet(null);
              setShowAddPetForm(true);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <Card key={pet.id} className="overflow-hidden border-0 bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
              <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                <img 
                  src={pet.imageUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${pet.name}&backgroundColor=ffd93d`} 
                  alt={pet.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${pet.name}&backgroundColor=ffd93d`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button 
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  onClick={() => handleEditPet(pet)}
                >
                  <Edit2 size={14} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.9</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 font-medium">{pet.breed}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{pet.age} years old</span>
                    <span>•</span>
                    <span className="capitalize">{pet.gender}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={`text-xs ${pet.vaccinated ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {pet.vaccinated ? '✓ Vaccinated' : '✗ Not vaccinated'}
                    </Badge>
                  </div>
                  
                  {pet.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-3 leading-relaxed">
                      {pet.description}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-white/50 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
                    onClick={() => handleEditPet(pet)}
                  >
                    <Edit2 size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-white/50 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                    onClick={() => navigate('/breeding')}
                  >
                    <Heart size={14} className="mr-1" />
                    Find Match
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PetsTab;
