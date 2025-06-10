
import { useState } from 'react';
import { Heart, User, MapPin, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    location: string;
    owner: string;
    image: string;
    description: string;
    gender: string;
    vaccinated: boolean;
  };
  onSwipe?: (direction: 'left' | 'right', petId: string) => void;
}

const PetCard = ({ pet, onSwipe }: PetCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const handleSwipe = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    setAnimationClass(direction === 'right' ? 'swipe-right' : 'swipe-left');
    
    setTimeout(() => {
      onSwipe?.(direction, pet.id);
      setIsAnimating(false);
      setAnimationClass('');
    }, 500);
  };

  return (
    <Card className={`relative w-full max-w-sm mx-auto overflow-hidden subtle-elevation border bg-card ${animationClass}`}>
      {/* Pet Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={pet.image || "/placeholder.svg"}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Pet Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-2xl font-bold mb-1">{pet.name}</h3>
          <p className="text-sm opacity-90">{pet.breed} • {pet.age} years old</p>
          <div className="flex items-center mt-2 text-sm opacity-80">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{pet.location}</span>
          </div>
        </div>

        {/* Vaccination Badge */}
        {pet.vaccinated && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Vaccinated
          </div>
        )}
      </div>

      {/* Pet Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-1" />
            <span>Owner: {pet.owner}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{pet.gender}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
          {pet.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
          >
            <X className="w-5 h-5 mr-2" />
            Pass
          </Button>
          <Button
            size="lg"
            className="flex-1 btn-gradient"
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
          >
            <Heart className="w-5 h-5 mr-2" />
            Match
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PetCard;
