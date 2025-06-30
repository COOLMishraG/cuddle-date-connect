// Pet enums matching backend
export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AnimalType {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  FISH = 'FISH',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}

// Pet interface matching backend model
export interface Pet {
  id: string;
  name: string;
  animal: AnimalType;
  breed: string;
  age: number;
  gender: PetGender;
  vaccinated: boolean;
  imageUrl: string; // Cloud-based image URL
  description: string;
  location?: string;
  isAvailableForMatch?: boolean;
  isAvailableForBoarding?: boolean;
  owner?: {
    id: string;
    username: string;
    displayName: string;
    name?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Pet creation/update data
export interface PetData {
  name: string;
  animal: AnimalType;
  breed: string;
  age: number;
  gender: PetGender;
  vaccinated: boolean;
  imageUrl?: string; // Cloud-based image URL
  description: string;
  location?: string;
  isAvailableForMatch?: boolean;
  isAvailableForBoarding?: boolean;
}
