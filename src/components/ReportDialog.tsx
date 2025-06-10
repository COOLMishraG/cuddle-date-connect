import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type ReportDialogProps = {
  children: React.ReactNode;
  variant?: 'testimonial' | 'report';
};

const ReportDialog = ({ children, variant = 'testimonial' }: ReportDialogProps) => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // For testimonial variant, save to localStorage to simulate persistence
      if (variant === 'testimonial') {
        // Get existing testimonials or initialize empty array
        const existingTestimonials = localStorage.getItem('userTestimonials') 
          ? JSON.parse(localStorage.getItem('userTestimonials') as string) 
          : [];
        
        // Add new testimonial with current date
        const newTestimonial = {
          id: `user-${Date.now()}`,
          name: formData.name,
          role: 'Pet Owner',
          content: formData.message,
          rating: formData.rating,
          avatar: '/placeholder.svg',
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        };
        
        // Save updated testimonials
        localStorage.setItem('userTestimonials', JSON.stringify([...existingTestimonials, newTestimonial]));
      } else {
        // In a real app, this would send report data to your backend API
        // Simulating API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      toast({
        title: variant === 'testimonial' ? "Testimonial Submitted" : "Report Submitted",
        description: "Thank you for your feedback! It will be reviewed by our team.",
      });
      
      // Reset form and close dialog
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 5
      });
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white romantic-card-accent">
        <DialogHeader>
          <DialogTitle className="text-burgundy fredoka">
            {variant === 'testimonial' ? 'Share Your Experience' : 'Report an Issue'}
          </DialogTitle>
          <DialogDescription>
            {variant === 'testimonial' 
              ? 'Tell us about your experience with PetMatch. Your feedback helps others make decisions.'
              : 'Please describe the issue you encountered so we can address it promptly.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="w-full"
              required
            />
          </div>
          
          {variant === 'testimonial' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        rating <= formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              {variant === 'testimonial' ? 'Your Experience' : 'Describe the Issue'}
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={variant === 'testimonial' 
                ? "Please share your experience with PetMatch..." 
                : "Please describe the issue in detail..."}
              className="w-full h-24"
              required
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="submit" 
              className="bg-burgundy hover:bg-deep-rose text-white w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {variant === 'testimonial' ? 'Submit Testimonial' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
