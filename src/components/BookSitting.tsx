import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';

// Props
interface BookSittingProps {
  open: boolean;
  onClose: () => void;
  sitterName?: string;
  sitterId?: string;
}

// Component for booking sitting services
const BookSitting = ({ open, onClose, sitterName = '', sitterId = '' }: BookSittingProps) => {
  const [formData, setFormData] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    petId: '',
    notes: '',
    serviceType: 'boarding' // 'boarding', 'daycare', 'home-visit'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock pets data - in real app, fetch from API
  const myPets = [
    { id: 'pet1', name: 'Max', image: '/placeholder.svg' },
    { id: 'pet2', name: 'Bella', image: '/placeholder.svg' }
  ];
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle date selection
  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };
  
  // Handle service type selection
  const handleServiceTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  };
  
  // Handle pet selection
  const handlePetChange = (value: string) => {
    setFormData(prev => ({ ...prev, petId: value }));
  };
  
  // Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.startDate || !formData.petId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // If booking boarding, ensure end date is provided
    if (formData.serviceType === 'boarding' && !formData.endDate) {
      toast({
        title: "End Date Required",
        description: "Please select an end date for boarding service.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Booking Successful!",
        description: "Your pet sitting request has been sent to the sitter.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold fredoka text-burgundy">Book Pet Sitting</DialogTitle>
          <DialogDescription>
            {sitterName ? `Request services from ${sitterName}` : 'Book a pet sitting service'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type <span className="text-burgundy">*</span></Label>
            <Select
              value={formData.serviceType}
              onValueChange={handleServiceTypeChange}
            >
              <SelectTrigger id="service-type">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boarding">Boarding (Overnight Stay)</SelectItem>
                <SelectItem value="daycare">Daycare</SelectItem>
                <SelectItem value="home-visit">Home Visit</SelectItem>
                <SelectItem value="walking">Dog Walking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Pet Selection */}
          <div className="space-y-2">
            <Label htmlFor="pet-select">Select Pet <span className="text-burgundy">*</span></Label>
            <Select
              value={formData.petId}
              onValueChange={handlePetChange}
            >
              <SelectTrigger id="pet-select">
                <SelectValue placeholder="Select your pet" />
              </SelectTrigger>
              <SelectContent>
                {myPets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date <span className="text-burgundy">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {formData.serviceType === 'boarding' && (
              <div className="space-y-2">
                <Label>End Date <span className="text-burgundy">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange('endDate', date)}
                      disabled={(date) => formData.startDate && date <= formData.startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            {formData.serviceType === 'daycare' || formData.serviceType === 'walking' || formData.serviceType === 'home-visit' ? (
              <div className="space-y-2">
                <Label>Time <span className="text-burgundy">*</span></Label>
                <Select defaultValue="morning">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 4pm)</SelectItem>
                    <SelectItem value="evening">Evening (4pm - 8pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
          
          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requirements, feeding instructions, etc."
              rows={3}
            />
          </div>
          
          {/* Estimated Cost - In a real app, calculate based on service type and duration */}
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">Estimated Cost</p>
            <p className="text-2xl font-bold text-burgundy">$25/day</p>
            <p className="text-xs text-muted-foreground">Final price will be confirmed by the sitter</p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-burgundy hover:bg-deep-rose text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending Request..." : "Book Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookSitting;
