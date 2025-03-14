export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  education: string;
  image: string;
  hospitalId?: string;
  contact: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
  image: string;
  specialties: string[];
  rating: number;
}

export interface Institute {
  id: string;
  name: string;
  address: string;
  contact: string;
  image: string;
  courses: string[];
  established: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}
