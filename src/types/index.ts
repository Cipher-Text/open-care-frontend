export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  education: string;
  image: string;
  hospitalId?: string;
  contact: string;
  rating: number;
  reviewCount: number;
}

export interface Hospital {
  id: number;
  type: string;
  name: string;
  address: string;
  contact: string;
  image: string;
  specialties: string[];
  rating: number;
  beds: number;
  doctors: string[];
}

export interface Institute {
  id: number;
  name: string;
  address: string;
  location: string;
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

export interface BlogPost {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
}

export interface FeaturedData {
  doctors: Doctor[];
  hospitals: Hospital[];
  institutes: Institute[];
  stats: {
    totalDoctors: number;
    totalHospitals: number;
    totalInstitutes: number;
    totalPatientsCared: number;
  };
}
