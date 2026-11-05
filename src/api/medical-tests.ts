import { publicGet } from "@/lib/api-client";
import { normalizePage, toWirePage } from "@/lib/pagination";
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
    page: toWirePage(page).toString(),
    size: size.toString(),
    sort,
    direction,
  });

  if (name) {
    params.append("name", name);
  }

  const data = await publicGet(`/medical-tests?${params}`);
	return normalizePage(data);
}
