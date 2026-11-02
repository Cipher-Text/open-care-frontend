import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { contentSecurityPolicy } from "./src/lib/csp";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Hosts that may serve optimized remote images (uploaded photos, covers, ad images), from NEXT_IMAGE_HOSTS: comma
// separated, a bare host or a host with a leading http:// or https:// (https when omitted), "*." wildcards allowed.
const imageHosts = (process.env.NEXT_IMAGE_HOSTS ?? "")
	.split(",")
	.map((entry) => entry.trim())
	.filter(Boolean);

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = imageHosts.map((entry) => {
	const protocol = entry.startsWith("http://") ? "http" : "https";
	return { protocol, hostname: entry.replace(/^https?:\/\//, "").replace(/\/.*$/, ""), pathname: "/**" };
});

const nextConfig: NextConfig = {
	images: { remotePatterns },
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Content-Security-Policy", value: contentSecurityPolicy({ development: process.env.NODE_ENV !== "production" }) },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					// Nothing here records from the camera or microphone; the location is only ever read by this site itself
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
					{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
				],
			},
		];
	},
};

export default withNextIntl(nextConfig);
