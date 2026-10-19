import { normalizePage, toWirePage } from "@/lib/pagination";
import { MedicalTestsListResponse } from "@/types/medical-tests";
import { baseUrl } from "@/config/config";

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
    page: toWirePage(page).toString(),
    size: size.toString(),
    sort,
    direction,
  });

  if (name) {
    params.append("name", name);
  }

  const response = await fetch(`${baseUrl}/medical-tests?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch medical tests");
  }

  return normalizePage(await response.json());
}
