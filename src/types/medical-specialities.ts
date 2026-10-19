import type { PageResult } from "@/types/common";
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

export type MedicalSpecialitiesListResponse = PageResult<MedicalSpeciality>;
