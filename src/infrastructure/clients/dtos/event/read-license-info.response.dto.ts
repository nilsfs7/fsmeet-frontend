import { LicenseType } from '@/domain/enums/license-type';

/** Response from `GET /v1/events/{eventId}/license/upgrade` (license upgrade info). */
export type ReadLicenseInfoResponseDto = {
  /** Amount in the smallest currency unit (e.g. cents), per Stripe minor units. */
  price: number;
  type: LicenseType;
};
