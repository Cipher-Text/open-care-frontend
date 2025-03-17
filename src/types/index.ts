// Update the Doctor type to match your API response
export interface Doctor {
  id: number;
  name: string;
  bnName: string;
  gender: string;
  bmdcNo: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  yearOfExperience: number;
  description: string | null;
  image: string | null;
  startDate: string | null;
  isActive: boolean;
  userId: number | null;
}

export interface DoctorResponse {
  totalItems: number;
  doctors: Doctor[];
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
