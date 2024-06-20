export function extractFileIdFromDiveLink(url: string): string | null {
  if (url.includes("id=")) {
    const startIndex = url.indexOf("id=") + 3;
    const endIndex = url.indexOf("&", startIndex);
    if (endIndex === -1) {
      return url.substring(startIndex);
    } else {
      return url.substring(startIndex, endIndex);
    }
  } else if (url.includes("export=view&id=")) {
    const startIndex = url.indexOf("export=view&id=") + 14;
    const endIndex = url.indexOf("&", startIndex);
    if (endIndex === -1) {
      return url.substring(startIndex);
    } else {
      return url.substring(startIndex, endIndex);
    }
  } else {
    // Invalid URL format
    return null;
  }
}
export function getWebViewLinkFromDiveId(
  id: string,
  w: number,
  h: number
): string {
  return `https://lh3.googleusercontent.com/d/${id}`;
}
export function getWebViewLinkFromWebContentLink(
  url: string | undefined,
  w = 1920,
  h = 1920
): string {
  if (!url) return "/img";
  let id: string | null = extractFileIdFromDiveLink(url);
  if (id) return getWebViewLinkFromDiveId(id, w, h);
  return url;
}
