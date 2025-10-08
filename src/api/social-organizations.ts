import { SocialOrganizationsListResponse } from "@/types/social-organizations";

interface FetchSocialOrganizationsParams {
  page: number;
  size: number;
  sort?: string;
  direction?: "ASC" | "DESC";
  name?: string;
}

export async function fetchSocialOrganizations({
  page,
  size,
  sort = "id",
  direction = "ASC",
  name,
}: FetchSocialOrganizationsParams): Promise<SocialOrganizationsListResponse> {
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
    `http://localhost:6700/api/social-organization?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch social organizations");
  }

  const data = await response.json();
  return data;
}
