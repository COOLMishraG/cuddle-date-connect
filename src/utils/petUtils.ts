import { AnimalType, PetGender } from '@/types/pet';

/**
 * Convert AnimalType enum to display-friendly string
 */
export const formatAnimalType = (animal: AnimalType): string => {
  switch (animal) {
    case AnimalType.DOG:
      return 'Dog';
    case AnimalType.CAT:
      return 'Cat';
    case AnimalType.BIRD:
      return 'Bird';
    case AnimalType.RABBIT:
      return 'Rabbit';
    case AnimalType.HAMSTER:
      return 'Hamster';
    case AnimalType.FISH:
      return 'Fish';
    case AnimalType.REPTILE:
      return 'Reptile';
    case AnimalType.OTHER:
      return 'Other';
    default:
      return 'Pet';
  }
};

/**
 * Convert PetGender enum to display-friendly string
 */
export const formatGender = (gender: PetGender): string => {
  return gender === PetGender.FEMALE ? 'Female' : 'Male';
};

/**
 * Get gender symbol
 */
export const getGenderSymbol = (gender: PetGender): string => {
  return gender === PetGender.FEMALE ? '♀️' : '♂️';
};

/**
 * Get animal type emoji
 */
export const getAnimalEmoji = (animal: AnimalType): string => {
  switch (animal) {
    case AnimalType.DOG:
      return '🐕';
    case AnimalType.CAT:
      return '🐱';
    case AnimalType.BIRD:
      return '🐦';
    case AnimalType.RABBIT:
      return '🐰';
    case AnimalType.HAMSTER:
      return '🐹';
    case AnimalType.FISH:
      return '🐠';
    case AnimalType.REPTILE:
      return '🦎';
    case AnimalType.OTHER:
    default:
      return '🐾';
  }
};
