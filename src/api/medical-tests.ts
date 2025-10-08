import { MedicalTestsListResponse } from "@/types/medical-tests";

interface FetchMedicalTestsParams {
  page: number;
  size: number;
  sort?: string;
  direction?: "ASC" | "DESC";
  name?: string;
}

export async function fetchMedicalTests({
  page,
  size,
  sort = "id",
  direction = "ASC",
  name,
}: FetchMedicalTestsParams): Promise<MedicalTestsListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
    direction,
  });

  if (name) {
    params.append("name", name);
  }

  const response = await fetch(
    `http://localhost:6700/api/medical-tests?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch medical tests");
  }

  const data = await response.json();
  return data;
}
