
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
      <section id="breeding" className="py-16 bg-background">
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
    <section id="breeding" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Your Pet's Perfect Match
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Swipe through potential breeding partners for your pet. Match with compatible pets and connect with their owners.
          </p>
        </div>

        <div className="max-w-md mx-auto relative">
          {/* Pet Card Stack */}
          <div className="relative">
            {pets.slice(currentPetIndex, currentPetIndex + 3).map((pet, index) => (
              <div
                key={pet.id}
                className={`absolute inset-0 transition-all duration-300 ${
                  index === 0 ? 'z-30' : index === 1 ? 'z-20 scale-95 opacity-70' : 'z-10 scale-90 opacity-40'
                }`}
                style={{
                  transform: index > 0 ? `translateY(${index * 8}px) scale(${1 - index * 0.05})` : 'none'
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
                    <div className="bg-white rounded-lg shadow-lg h-96"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {currentPetIndex + 1} of {pets.length} pets
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Swipe left to pass • Swipe right to match
          </p>
        </div>
      </div>
    </section>
  );
};

export default MatchingSection;
