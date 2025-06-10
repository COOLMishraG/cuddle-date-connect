import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
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
interface ScheduleVetProps {
  open: boolean;
  onClose: () => void;
  vetName?: string;
  vetId?: string;
  isEmergency?: boolean;
}

// Component for scheduling vet appointments
const ScheduleVet = ({ open, onClose, vetName = '', vetId = '', isEmergency = false }: ScheduleVetProps) => {
  const [formData, setFormData] = useState({
    appointmentDate: undefined as Date | undefined,
    petId: '',
    reason: isEmergency ? 'Emergency care' : '',
    description: '',
    timeSlot: '',
    isEmergency: isEmergency,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock pets data - in real app, fetch from API
  const myPets = [
    { id: 'pet1', name: 'Max', image: '/placeholder.svg' },
    { id: 'pet2', name: 'Bella', image: '/placeholder.svg' }
  ];
  
  // Mock available time slots - in real app, fetch from API based on selected date
  const timeSlots = [
    { id: '1', time: '9:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '1:00 PM', available: true },
    { id: '5', time: '2:00 PM', available: true },
    { id: '6', time: '3:00 PM', available: false },
    { id: '7', time: '4:00 PM', available: true },
  ];
  
  // Common appointment reasons
  const appointmentReasons = [
    'Regular checkup',
    'Vaccination',
    'Illness',
    'Injury',
    'Dental care',
    'Behavioral issues',
    'Emergency care',
    'Other'
  ];
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, appointmentDate: date }));
  };
  
  // Handle reason selection
  const handleReasonChange = (value: string) => {
    setFormData(prev => ({ ...prev, reason: value }));
  };
  
  // Handle pet selection
  const handlePetChange = (value: string) => {
    setFormData(prev => ({ ...prev, petId: value }));
  };
  
  // Handle time slot selection
  const handleTimeSlotChange = (value: string) => {
    setFormData(prev => ({ ...prev, timeSlot: value }));
  };
  
  // Toggle emergency status
  const handleEmergencyChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isEmergency: checked }));
  };
  
  // Submit appointment request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form for non-emergency appointments
    if (!formData.isEmergency && (!formData.appointmentDate || !formData.petId || !formData.timeSlot)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to schedule an appointment.",
        variant: "destructive"
      });
      return;
    }
    
    // For emergency, just pet selection is required
    if (formData.isEmergency && !formData.petId) {
      toast({
        title: "Missing Information", 
        description: "Please select the pet that needs emergency care.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.isEmergency) {
        toast({
          title: "Emergency Request Sent",
          description: "A veterinarian will contact you immediately. Please proceed to the clinic if instructed.",
        });
      } else {
        toast({
          title: "Appointment Scheduled",
          description: `Your appointment has been scheduled for ${formData.appointmentDate ? format(formData.appointmentDate, "PPP") : ""} at ${timeSlots.find(slot => slot.id === formData.timeSlot)?.time || ""}`,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling your appointment. Please try again.",
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
          <DialogTitle className="text-2xl font-bold fredoka text-burgundy">
            {formData.isEmergency ? 'Emergency Veterinary Care' : 'Schedule Vet Appointment'}
          </DialogTitle>
          <DialogDescription>
            {formData.isEmergency 
              ? 'Request immediate care for your pet'
              : vetName 
                ? `Schedule an appointment with ${vetName}` 
                : 'Schedule a veterinary appointment'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Emergency Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emergency-toggle" className="text-base">Emergency Care</Label>
              <p className="text-xs text-muted-foreground">
                Toggle on for urgent medical assistance
              </p>
            </div>
            <Switch
              id="emergency-toggle"
              checked={formData.isEmergency}
              onCheckedChange={handleEmergencyChange}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
          
          {formData.isEmergency && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              <p className="font-medium">For life-threatening emergencies:</p>
              <p>Please call our emergency hotline at (555) 123-4567 and proceed immediately to the nearest veterinary emergency center.</p>
            </div>
          )}
          
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
          
          {/* Appointment Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason-select">Reason for Visit {!formData.isEmergency && <span className="text-burgundy">*</span>}</Label>
            <Select
              value={formData.reason}
              onValueChange={handleReasonChange}
            >
              <SelectTrigger id="reason-select">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {appointmentReasons.map(reason => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {formData.isEmergency ? 'Describe the emergency' : 'Description'} 
              {formData.isEmergency && <span className="text-burgundy">*</span>}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={formData.isEmergency 
                ? "Describe the emergency situation and your pet's symptoms"
                : "Additional details about your pet's condition"
              }
              rows={3}
              required={formData.isEmergency}
            />
          </div>
          
          {/* Regular appointment scheduling (only show if not emergency) */}
          {!formData.isEmergency && (
            <>
              <div className="space-y-2">
                <Label>Appointment Date <span className="text-burgundy">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.appointmentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.appointmentDate ? format(formData.appointmentDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.appointmentDate}
                      onSelect={handleDateChange}
                      disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Time Slots - only show if date is selected */}
              {formData.appointmentDate && (
                <div className="space-y-2">
                  <Label>Available Time Slots <span className="text-burgundy">*</span></Label>
                  <RadioGroup 
                    value={formData.timeSlot}
                    onValueChange={handleTimeSlotChange}
                    className="grid grid-cols-3 gap-2"
                  >
                    {timeSlots.map(slot => (
                      <Label
                        key={slot.id}
                        htmlFor={`time-${slot.id}`}
                        className={`flex flex-col items-center justify-center border rounded-md p-2 cursor-pointer hover:bg-muted transition-colors
                          ${formData.timeSlot === slot.id ? 'border-burgundy bg-burgundy/5' : 'border-gray-200'}
                          ${!slot.available ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                        `}
                      >
                        <RadioGroupItem 
                          value={slot.id} 
                          id={`time-${slot.id}`} 
                          disabled={!slot.available}
                          className="sr-only"
                        />
                        <span className={`text-sm ${formData.timeSlot === slot.id ? 'text-burgundy font-medium' : ''}`}>
                          {slot.time}
                        </span>
                        {!slot.available && <span className="text-xs text-red-500">Booked</span>}
                        {formData.timeSlot === slot.id && slot.available && (
                          <CheckCircle className="h-4 w-4 text-burgundy mt-1" />
                        )}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </>
          )}
          
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
              className={formData.isEmergency ? "bg-red-600 hover:bg-red-700 text-white" : "bg-burgundy hover:bg-deep-rose text-white"}
              disabled={isLoading}
            >
              {isLoading 
                ? formData.isEmergency ? "Sending Emergency Request..." : "Scheduling..." 
                : formData.isEmergency ? "Request Emergency Care" : "Schedule Appointment"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleVet;
