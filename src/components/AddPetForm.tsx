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
import { Upload, Camera, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { petApi } from '@/services/api';

// Types based on your backend Pet entity
export type PetGender = 'MALE' | 'FEMALE';

export type PetFormData = {
  name: string;
  breed: string;
  age: number;
  gender: PetGender;
  vaccinated: boolean;
  description: string;
  location: string;
  isAvailableForMatch: boolean;
  isAvailableForBoarding: boolean;
  images: string[];
  _imageFile?: File; // Property to store the actual file for upload
};

interface AddPetFormProps {
  open: boolean;
  onClose: () => void;
  onPetAdded?: (pet: any) => void;
  existingPet?: any;
}

const AddPetForm = ({ open, onClose, onPetAdded, existingPet }: AddPetFormProps) => {
  const { currentUser } = useAuth();
  
  // Initial form data
  const initialFormData: PetFormData = {
    name: existingPet?.name || '',
    breed: existingPet?.breed || '',
    age: existingPet?.age || 0,
    gender: existingPet?.gender || 'MALE',
    vaccinated: existingPet?.vaccinated || false,
    description: existingPet?.description || '',
    location: existingPet?.location || currentUser?.location || '',
    isAvailableForMatch: existingPet?.isAvailableForMatch || false,
    isAvailableForBoarding: existingPet?.isAvailableForBoarding || false,
    images: existingPet?.images || ['/placeholder.svg'],
  };
  
  const [formData, setFormData] = useState<PetFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    // File input reference
  const fileInputRef = useState<HTMLInputElement | null>(null);
  
  // Handle image upload via file input
  const handleImageUpload = () => {
    // Create a hidden file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png, image/gif';
    input.multiple = false;
    
    // Handle file selection
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG or GIF image.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const previewUrl = e.target.result.toString();
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, previewUrl],
            // Store the actual file to upload later
            _imageFile: file
          }));
        }
      };
      reader.readAsDataURL(file);
    };
    
    // Trigger file selection
    input.click();
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        vaccinated: formData.vaccinated,
        description: formData.description,
        location: formData.location,
        isAvailableForMatch: formData.isAvailableForMatch,
        isAvailableForBoarding: formData.isAvailableForBoarding,
        userId: currentUser.id
      };
      
      let response;
      
      // Create or update the pet in the backend
      if (existingPet) {
        response = await petApi.updatePet(existingPet.id, petData);
      } else {
        response = await petApi.createPet(petData);
      }
      
      // If we have a new image file to upload and pet was created/updated successfully
      if (formData._imageFile && response.id) {
        try {
          // Upload the pet photo
          const photoResult = await petApi.uploadPetPhoto(response.id, formData._imageFile);
          
          // Update the response with the new image URL
          if (photoResult.image) {
            response.image = photoResult.image;
          }
        } catch (photoError) {
          console.error('Failed to upload pet photo:', photoError);
          // We don't want to fail the whole operation if just the photo upload fails
          toast({
            title: "Warning",
            description: "Pet was saved but the photo couldn't be uploaded. You can try again later.",
            variant: "default",
          });
        }
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
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
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
            <Label>Pet Photos</Label>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={image}
                    alt={`Pet ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-rose-500/80 text-white p-1 rounded-bl-md"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-burgundy transition-colors"
              >
                <Upload size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload multiple photos of your pet (max 5)
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
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
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
              className="bg-burgundy hover:bg-deep-rose text-white"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Saving...' 
                : existingPet ? 'Update Pet' : 'Add Pet'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetForm;
