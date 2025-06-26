import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, AlertTriangle } from 'lucide-react';

const AuthError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description') || 'An error occurred during authentication';

  // Redirect to sign in after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center">
      <Card className="p-8 max-w-md mx-auto text-center shadow-lg">
        <div className="mb-6">
          <div className="flex justify-center items-center mb-4">
            <Heart size={30} className="text-burgundy mr-2" />
            <AlertTriangle size={30} className="text-deep-rose" />
          </div>
          <h1 className="text-2xl font-semibold text-burgundy mb-2">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{errorDescription}</p>
          <p className="text-sm text-gray-500 mb-6">You'll be redirected to the sign-in page in 5 seconds.</p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
          
          <Button 
            className="bg-burgundy hover:bg-deep-rose text-white"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
        </div>
        
        <p className="mt-6 text-xs text-gray-500">
          Error code: {error || 'unknown'}
        </p>
      </Card>
    </div>
  );
};

export default AuthError;
