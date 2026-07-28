/** Bump when job-terms content changes materially; forces re-accept via local version check. */
export const JOB_TERMS_VERSION = '2026-07-28-3';

export function jobTermsAcceptedVersionStorageKey(username: string): string {
  return `jobTermsAcceptedVersion:${username}`;
}
