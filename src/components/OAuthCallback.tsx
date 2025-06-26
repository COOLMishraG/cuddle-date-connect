import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        
        if (error) {
          setError(decodeURIComponent(error));
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
          return;
        }
        
        if (!token) {
          setError('No authentication token found in URL');
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
          return;
        }
        
        // Use AuthContext to handle OAuth callback
        await handleOAuthCallback(token);
        
        // Redirect to profile after successful authentication
        navigate('/profile');
        
      } catch (err) {
        console.error('OAuth callback processing error:', err);
        setError(err instanceof Error ? err.message : 'Failed to authenticate');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center">
      <div className="text-center p-8 max-w-md rounded-xl bg-white/80 shadow-lg backdrop-blur">
        {error ? (
          <>
            <div className="text-deep-rose mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-xl font-medium text-burgundy mb-2">Authentication Failed</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Heart size={40} className="text-burgundy animate-pulse" />
              <Loader2 className="animate-spin text-burgundy mx-2 mt-2" size={24} />
            </div>
            <h1 className="text-xl font-medium text-burgundy mb-2">
              Completing authentication...
            </h1>
            <p className="text-gray-700">Please wait while we sign you in.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
