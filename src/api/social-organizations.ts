import { publicGet } from "@/lib/api-client";
import { normalizePage, toWirePage } from "@/lib/pagination";
import {
  SocialOrganizationsListResponse,
  SocialOrganization,
} from "@/types/social-organizations";

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
    page: toWirePage(page).toString(),
    size: size.toString(),
    sort,
    direction,
  });

  if (name) {
    params.append("name", name);
  }

  const data = await publicGet(`/social-organization?${params}`);
	return normalizePage(data);
}

export async function fetchSocialOrganizationById(
  id: string
): Promise<SocialOrganization> {
  const data = await publicGet(`/social-organization/${id}`);
	return data;
}
