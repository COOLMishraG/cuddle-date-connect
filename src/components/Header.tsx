import { useState, useEffect } from 'react';
import { Heart, User, Menu, X, LogOut, Home, Stethoscope, Users, Dog, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { matchApi } from '@/services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, signOut } = useAuth();

  // Fetch pending match requests count
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (isAuthenticated && currentUser) {
        try {
          const requests = await matchApi.getReceivedMatchRequests(currentUser.id, 'pending');
          setPendingRequestsCount(requests.length);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
          // Don't show error to user for notifications
        }
      }
    };

    fetchPendingRequests();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchPendingRequests, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, currentUser]);

  const navItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'breeding', label: 'Breeding', path: '/breeding', icon: Dog },
    { id: 'sitting', label: 'Pet Sitting', path: '/pet-sitting', icon: Heart },
    { id: 'vets', label: 'Veterinary', path: '/veterinary', icon: Stethoscope },
    { id: 'community', label: 'Community', path: '/community', icon: Users }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PetMatch
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className="relative group px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="relative bg-gray-100/50 hover:bg-gray-200/50 text-gray-700 border-0 rounded-xl transition-all duration-300"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {pendingRequestsCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center"
                  >
                    {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                  </Badge>
                )}
              </Button>
            )}
            
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="bg-gray-100/50 hover:bg-gray-200/50 text-gray-700 border-0 rounded-xl transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/signin')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-gray-100/50 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl rounded-b-2xl border-t border-gray-200/50 shadow-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              {isAuthenticated && (
                <button
                  onClick={() => handleNavClick('/')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                  {pendingRequestsCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center ml-auto">
                      {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                    </Badge>
                  )}
                </button>
              )}
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavClick('/profile')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('/signin')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
