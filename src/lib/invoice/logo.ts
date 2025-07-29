export async function isValidLogoUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url);

    return response.ok;
  } catch {
    return false;
  }
}

export function getWebsiteLogo(website?: string | null) {
  if (!website) return "";

  return `https://img.logo.dev/${website}?token=${encodeURIComponent(
    "pk_HS4IwQOHQ6-MBrSH9amcPw"
  )}&size=180&retina=true`;
}
