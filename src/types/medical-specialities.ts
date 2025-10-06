export interface MedicalSpeciality {
  id: number;
  parentId: number | null;
  name: string;
  bnName: string;
  icon: string;
  imageUrl: string | null;
  description: string | null;
  doctorCount: number | null;
}

export interface MedicalSpecialitiesListResponse {
  medicalSpecialities: MedicalSpeciality[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  status?: number;
}
