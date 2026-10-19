import type { PageResult } from "@/types/common";
export interface MedicalTest {
  id: number;
  parentId: number | null;
  name: string;
  bnName: string;
  alternativeNames: string | null;
  description: string | null;
  hospitalCount: number | null;
}

export type MedicalTestsListResponse = PageResult<MedicalTest>;
