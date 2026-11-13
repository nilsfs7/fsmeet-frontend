/**
 * Uploaded images (e.g. ad creatives) keep the same S3 URL when they are replaced, and the bucket sends no
 * Cache-Control header, so browsers keep showing the old file from their (heuristic) cache.
 */

function isUploadedImageUrl(url: URL): boolean {
  return url.hostname.endsWith('amazonaws.com');
}

/** Adds a version query param to uploaded-image URLs so management views always show the current file. */
export function withImageVersion(url: string | undefined, version: string | number): string | undefined {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (!isUploadedImageUrl(parsed)) return url;
    parsed.searchParams.set('v', String(version));
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Re-downloads an image URL bypassing the HTTP cache, so later views of the plain URL get the new file. */
export async function refreshCachedImage(url: string | undefined): Promise<void> {
  if (!url || typeof window === 'undefined') return;
  try {
    await fetch(url, { mode: 'no-cors', cache: 'reload' });
  } catch {
    // best effort only
  }
}
