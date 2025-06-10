import { useAuth } from '@/contexts/AuthContext';
import { Shield, ShieldCheck } from 'lucide-react';

const AuthStatus = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 border border-rose z-50 flex items-center">
      <div className="w-6 h-6 gradient-warm rounded-lg flex items-center justify-center mr-2">
        <ShieldCheck className="w-3 h-3 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-burgundy">
          Signed in as <span className="font-bold">{currentUser?.name}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthStatus;
