export const SITE_URL = "https://howtodev.site";

export function siteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${normalizedPath.replace(/\/$/, "")}`;
}
