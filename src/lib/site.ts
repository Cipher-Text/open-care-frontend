/** Public origin of the web app, used for the sitemap and robots.txt. Set NEXT_PUBLIC_SITE_URL per environment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://opencarebd.com").replace(/\/$/, "");
