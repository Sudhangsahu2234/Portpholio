const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  (process.env.VERCEL_ENV === "production" ? process.env.VERCEL_URL : undefined);

function readSiteUrl(): URL | undefined {
  const value = configuredUrl || deploymentHost;
  if (!value) return undefined;

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (url.protocol === "https:" || url.protocol === "http:") return new URL(url.origin);
  } catch {
    // An invalid or absent deployment origin should never become a canonical URL.
  }
  return undefined;
}

export const siteUrl = readSiteUrl();
