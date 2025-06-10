import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If still checking authentication status, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBE7E7] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-burgundy text-lg mb-2">Loading...</div>
          <p className="text-deep-rose text-sm">Please wait while we verify your session.</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in page and remember where the user was trying to go
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
