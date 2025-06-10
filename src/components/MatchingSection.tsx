
import { useState } from 'react';
import PetCard from './PetCard';
import { Button } from '@/components/ui/button';

const MatchingSection = () => {
  const [currentPetIndex, setCurrentPetIndex] = useState(0);

  // Mock data - replace with your API data
  const pets = [
    {
      id: '1',
      name: 'Luna',
      breed: 'Golden Retriever',
      age: 3,
      location: 'San Francisco, CA',
      owner: 'Sarah Wilson',
      image: '/placeholder.svg',
      description: 'Luna is a friendly and energetic Golden Retriever looking for a breeding partner. She loves playing fetch and is great with children.',
      gender: 'Female',
      vaccinated: true
    },
    {
      id: '2',
      name: 'Max',
      breed: 'Labrador',
      age: 4,
      location: 'Los Angeles, CA',
      owner: 'John Smith',
      image: '/placeholder.svg',
      description: 'Max is a gentle giant with a calm temperament. He enjoys long walks and has excellent breeding history.',
      gender: 'Male',
      vaccinated: true
    },
    {
      id: '3',
      name: 'Bella',
      breed: 'German Shepherd',
      age: 2,
      location: 'Seattle, WA',
      owner: 'Emily Davis',
      image: '/placeholder.svg',
      description: 'Bella is intelligent and loyal. She comes from a line of show dogs and would make an excellent breeding partner.',
      gender: 'Female',
      vaccinated: true
    }
  ];

  const handleSwipe = (direction: 'left' | 'right', petId: string) => {
    console.log(`Swiped ${direction} on pet ${petId}`);
    
    // Move to next pet
    if (currentPetIndex < pets.length - 1) {
      setCurrentPetIndex(currentPetIndex + 1);
    } else {
      // Reset to first pet or show "no more pets" message
      setCurrentPetIndex(0);
    }

    if (direction === 'right') {
      // Handle match logic here
      console.log('It\'s a match!');
    }
  };

  const resetStack = () => {
    setCurrentPetIndex(0);
  };

  if (pets.length === 0) {
    return (
      <section id="breeding" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">No more pets to show</h2>
          <Button onClick={resetStack} className="btn-gradient">
            Start Over
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="breeding" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Your Pet's Perfect Match
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Swipe through potential breeding partners for your pet. Match with compatible pets and connect with their owners to start meaningful conversations.
          </p>
        </div>

        <div className="max-w-md mx-auto relative">
          {/* Pet Card Stack with subtle depth */}
          <div className="relative h-[600px]">
            {pets.slice(currentPetIndex, currentPetIndex + 3).map((pet, index) => (
              <div
                key={pet.id}
                className={`absolute inset-0 transition-all duration-300 ${
                  index === 0 ? 'z-30' : index === 1 ? 'z-20 scale-98 opacity-80' : 'z-10 scale-96 opacity-60'
                }`}
                style={{
                  transform: index > 0 ? `translateY(${index * 8}px) translateX(${index * 2}px) scale(${1 - index * 0.02})` : 'none'
                }}
              >
                {index === 0 && (
                  <PetCard
                    pet={pet}
                    onSwipe={handleSwipe}
                  />
                )}
                {index > 0 && (
                  <div className="w-full max-w-sm mx-auto">
                    <div className="bg-card rounded-lg subtle-elevation h-[500px] border border-border"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center bg-card rounded-lg px-6 py-3 subtle-elevation border border-border">
              <span className="text-sm font-medium text-muted-foreground">
                {currentPetIndex + 1} of {pets.length} pets
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 bg-card rounded-lg px-8 py-4 subtle-elevation border border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">←</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Pass</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">→</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Match</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatchingSection;
