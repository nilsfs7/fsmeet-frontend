/** Base URL of the standalone Training app (signs in via FSMeet OAuth). Defaults to production. */
export function getTrainingBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_FRONTEND_URL_TRAINING || 'https://training.fsmeet.com').replace(/\/$/, '');
}
