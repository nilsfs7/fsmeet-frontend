export function buildFreestyleActsFreestylerUrl(username: string): string {
  const base = (process.env.NEXT_PUBLIC_FRONTEND_URL_FREESTYLEACTS || '').replace(/\/$/, '');
  return `${base}/freestylers/${encodeURIComponent(username)}`;
}
