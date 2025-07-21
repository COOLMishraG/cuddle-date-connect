import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { petApi } from '@/services/api';
import { uploadImageToCloudinary, validateImageFile } from '@/services/cloudinary';
import { PetGender, AnimalType } from '@/types/pet';

export type PetFormData = {
  name: string;
  animal: AnimalType;
  breed: string;
  age: number;
  gender: PetGender;
  vaccinated: boolean;
  description: string;
  location: string;
  isAvailableForMatch: boolean;
  isAvailableForBoarding: boolean;
  images: string[];
  imageUrl?: string; // Single main image URL from cloud storage
};

interface AddPetFormProps {
  open: boolean;
  onClose: () => void;
  onPetAdded?: (pet: any) => void;
  existingPet?: any;
}

interface AiAnalysisResult {
  animalType: string;
  breed: string;
  description: string;
}

const AddPetForm = ({ open, onClose, onPetAdded, existingPet }: AddPetFormProps) => {
  const { currentUser } = useAuth();
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  
  // Initial form data
  const initialFormData: PetFormData = {
    name: existingPet?.name || '',
    animal: existingPet?.animal || AnimalType.DOG,
    breed: existingPet?.breed || '',
    age: existingPet?.age || 0,
    gender: existingPet?.gender || PetGender.MALE,
    vaccinated: existingPet?.vaccinated || false,
    description: existingPet?.description || '',
    location: existingPet?.location || currentUser?.location || '',
    isAvailableForMatch: existingPet?.isAvailableForMatch || false,
    isAvailableForBoarding: existingPet?.isAvailableForBoarding || false,
    images: existingPet?.images || ['/placeholder.svg'],
    imageUrl: existingPet?.imageUrl || '',
  };
  
  const [formData, setFormData] = useState<PetFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Special handling for number inputs
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle toggle change (checkboxes, switches)
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // Handle image upload via file input with Cloudinary
  const handleImageUpload = async () => {
    // Create a hidden file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png, image/gif, image/webp';
    input.multiple = false;
    
    // Handle file selection
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
      
      setIsUploadingImage(true);
      
      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(file, 'pets');
        
        // Update form data with the cloud URL
        setFormData(prev => ({
          ...prev,
          imageUrl: cloudinaryUrl,
          images: [cloudinaryUrl] // Replace the placeholder with the actual image
        }));
        
        console.log('Image uploaded successfully. URL:', cloudinaryUrl);

        toast({
          title: "Image uploaded",
          description: "Your pet's photo has been uploaded successfully!",
        });
        
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploadingImage(false);
      }
    };
    
    // Trigger file selection
    input.click();
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Prepare pet data for backend
      const petData = {
        name: formData.name,
        animal: formData.animal,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        vaccinated: formData.vaccinated,
        description: formData.description,
        location: formData.location,
        isAvailableForMatch: formData.isAvailableForMatch,
        isAvailableForBoarding: formData.isAvailableForBoarding,
        userId: currentUser.id,
        imageUrl: formData.imageUrl || null // Include the cloud image URL
      };
      
      let response;
      
      // Create or update the pet in the backend
      if (existingPet) {
        response = await petApi.updatePet(existingPet.id, petData);
      } else {
        response = await petApi.createPet(petData, currentUser.username);
      }
      
      if (onPetAdded) {
        onPetAdded(response);
      }
      
      toast({
        title: existingPet ? "Pet Updated" : "Pet Added",
        description: existingPet 
          ? `${formData.name}'s profile has been updated successfully!` 
          : `${formData.name} has been added to your pets!`,
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to save pet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <div className="flex gap-6">
          <div className="flex-1">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold fredoka text-burgundy">
                {existingPet ? 'Edit Pet' : 'Add New Pet'}
              </DialogTitle>
              <DialogDescription>
                {existingPet 
                  ? 'Update your pet\'s information below' 
                  : 'Fill in your pet\'s details to add them to your profile'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Pet Images */}
          <div className="space-y-2">
            <Label>Pet Photo</Label>
            <div className="flex flex-wrap gap-2">
              {/* Display uploaded image or placeholder */}
              {formData.imageUrl ? (
                <div className="flex gap-2 items-start">
                  <div className="relative w-20 h-20">
                    <img
                      src={formData.imageUrl}
                      alt="Pet"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        imageUrl: '', 
                        images: ['/placeholder.svg'] 
                      }))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={async () => {
                      try {
                        const result = await petApi.analyzePetImage(formData.imageUrl);
                        // Update type and breed automatically
                        setFormData(prev => ({
                          ...prev,
                          animal: result.animalType,
                          breed: result.breed,
                        }));
                        // Show AI analysis
                        setAiAnalysis(result);
                        toast({
                          title: "AI Analysis Complete",
                          description: "Review the AI suggested details.",
                        });
                      } catch (error) {
                        toast({
                          title: "Analysis Failed",
                          description: "Could not analyze the pet image. Please fill in the details manually.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Camera size={16} />
                    Analyze with AI
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={isUploadingImage}
                  className="group w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:border-burgundy transition-colors disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <Loader2 size={20} className="text-burgundy animate-spin" />
                  ) : (
                    <>
                      <Upload size={16} className="text-gray-500 group-hover:text-burgundy" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isUploadingImage ? 'Uploading...' : 'Upload a photo of your pet (JPG, PNG, GIF, WebP - max 10MB)'}
            </p>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name <span className="text-burgundy">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Max"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="animal">Animal Type <span className="text-burgundy">*</span></Label>
              <Select
                defaultValue={formData.animal}
                onValueChange={(value) => handleSelectChange('animal', value)}
              >
                <SelectTrigger id="animal">
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AnimalType.DOG}>Dog</SelectItem>
                  <SelectItem value={AnimalType.CAT}>Cat</SelectItem>
                  <SelectItem value={AnimalType.BIRD}>Bird</SelectItem>
                  <SelectItem value={AnimalType.RABBIT}>Rabbit</SelectItem>
                  <SelectItem value={AnimalType.HAMSTER}>Hamster</SelectItem>
                  <SelectItem value={AnimalType.FISH}>Fish</SelectItem>
                  <SelectItem value={AnimalType.REPTILE}>Reptile</SelectItem>
                  <SelectItem value={AnimalType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breed">Breed <span className="text-burgundy">*</span></Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                placeholder="e.g., Golden Retriever"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age (years) <span className="text-burgundy">*</span></Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender <span className="text-burgundy">*</span></Label>
              <Select
                defaultValue={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PetGender.MALE}>Male</SelectItem>
                  <SelectItem value={PetGender.FEMALE}>Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            
            <div className="space-y-2 flex items-center col-span-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vaccinated"
                  checked={formData.vaccinated}
                  onCheckedChange={(checked) => 
                    handleToggleChange('vaccinated', checked === true)
                  }
                />
                <Label htmlFor="vaccinated">Vaccinated</Label>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your pet's personality, likes, dislikes..."
              rows={3}
            />
          </div>
          
          {/* Availability Options */}
          <div className="space-y-3 pt-2">
            <Label>Availability</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isAvailableForMatch" className="text-base">Available for Breeding</Label>
                <p className="text-xs text-muted-foreground">
                  Show your pet in breeding matches
                </p>
              </div>
              <Switch
                id="isAvailableForMatch"
                checked={formData.isAvailableForMatch}
                onCheckedChange={(checked) => 
                  handleToggleChange('isAvailableForMatch', checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isAvailableForBoarding" className="text-base">Available for Boarding</Label>
                <p className="text-xs text-muted-foreground">
                  Allow pet sitters to offer services
                </p>
              </div>
              <Switch
                id="isAvailableForBoarding"
                checked={formData.isAvailableForBoarding}
                onCheckedChange={(checked) => 
                  handleToggleChange('isAvailableForBoarding', checked)
                }
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Saving...' 
                : existingPet ? 'Update Pet' : 'Add Pet'
              }
            </Button>
          </DialogFooter>
        </form>
          </div>

          {/* AI Analysis Side Panel */}
          {aiAnalysis && (
            <div className="w-80 border-l pl-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-burgundy mb-2">AI Analysis Results</h3>
                <p className="text-sm text-muted-foreground">Review the AI-suggested details for your pet</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Detected Animal Type</Label>
                  <p className="text-sm text-muted-foreground">{aiAnalysis.animalType}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-semibold">Detected Breed</Label>
                  <p className="text-sm text-muted-foreground">{aiAnalysis.breed}</p>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Suggested Description</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{aiAnalysis.description}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      animal: aiAnalysis.animalType as AnimalType,
                      breed: aiAnalysis.breed,
                      description: aiAnalysis.description
                    }));
                    toast({
                      title: "AI Details Added",
                      description: "Animal type, breed, and description have been added to the form.",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Add to Pet Description
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetForm;
