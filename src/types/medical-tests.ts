export interface MedicalTest {
  id: number;
  parentId: number | null;
  name: string;
  bnName: string;
  alternativeNames: string | null;
  description: string | null;
  hospitalCount: number | null;
}

export interface MedicalTestsListResponse {
  medicalTests: MedicalTest[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  status?: number;
}
