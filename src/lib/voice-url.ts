export function getVoiceBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_FRONTEND_URL_VOICE || '').replace(/\/$/, '');
}
