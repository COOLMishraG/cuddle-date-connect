import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A hook that guards routes requiring authentication
 * @param redirectPath The path to redirect to if the user is not authenticated
 */
const useAuthGuard = (redirectPath: string = '/signin') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectPath, { state: { redirectTo: window.location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);
  
  return { isAuthenticated, isLoading };
};

export default useAuthGuard;
