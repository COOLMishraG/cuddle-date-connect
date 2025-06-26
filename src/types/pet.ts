// Pet interface matching backend model
export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  vaccinated: boolean;
  image: string;
  description: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Pet creation/update data
export interface PetData {
  name: string;
  breed: string;
  age: number;
  gender: string;
  vaccinated: boolean;
  image?: string;
  description: string;
  userId?: string;
}
