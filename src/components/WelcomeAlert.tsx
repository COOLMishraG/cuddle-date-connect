import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WelcomeAlert = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (isAuthenticated || dismissed) {
    return null;
  }

  return (
    <Alert className="bg-white/90 backdrop-blur-sm border-rose shadow-lg max-w-3xl mx-auto mb-8 subtle-elevation relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
      </div>
      <div className="flex items-start">
        <div className="w-6 h-6 gradient-warm rounded-lg flex items-center justify-center mr-3 mt-0.5">
          <Heart className="w-3 h-3 text-white" />
        </div>
        <div>
          <AlertTitle className="text-burgundy text-lg font-semibold mb-2">
            Welcome to PetMatch!
          </AlertTitle>
          <AlertDescription className="text-gray-700">
            <p className="mb-3">
              Sign in to access all features including pet matchmaking, pet sitting services, and vet appointments.
            </p>
            <Button
              size="sm"
              className="btn-gradient"
              onClick={() => navigate('/signin')}
            >
              Sign In Now
            </Button>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default WelcomeAlert;
