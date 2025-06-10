
import { useState, useRef, useEffect } from 'react';
import { Heart, User, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [capsuleStyle, setCapsuleStyle] = useState({ width: 0, left: 0 });
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const navItems = [
    { id: 'breeding', label: 'Breeding', path: '/breeding', description: 'Find perfect breeding partners for your pets' },
    { id: 'sitting', label: 'Pet Sitting', path: '/pet-sitting', description: 'Book trusted sitters for your pets' },
    { id: 'vets', label: 'Veterinary', path: '/veterinary', description: 'Connect with certified veterinarians' },
    { id: 'community', label: 'Community', path: '/community', description: 'Join our pet lover community' }
  ];

  const handleMouseEnter = (item: any, event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const navRect = navRef.current?.getBoundingClientRect();
    
    if (navRect) {
      setCapsuleStyle({
        width: rect.width + 16,
        left: rect.left - navRect.left - 8
      });
    }
    
    setHoveredItem(item.id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 gradient-warm rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold fredoka bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PetMatch
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav 
            ref={navRef} 
            className="hidden md:flex items-center space-x-8 relative"
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className={`nav-capsule ${hoveredItem ? 'active' : ''}`}
              style={capsuleStyle}
            />
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  className="text-foreground hover:text-primary transition-colors font-medium relative z-10 px-4 py-2"
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.label}
                </button>
                <div className={`tooltip ${hoveredItem === item.id ? 'show' : ''}`}>
                  {item.description}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button className="btn-gradient">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className="text-foreground hover:text-primary transition-colors font-medium text-left"
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full">
                  Profile
                </Button>
                <Button className="btn-gradient w-full">
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
