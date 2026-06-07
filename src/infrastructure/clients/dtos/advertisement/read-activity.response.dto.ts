import { Platform } from '@/domain/enums/platform';

export class ReadAdvertisementActivityResponseDto {
  month: string;
  platform: Platform;
  countryCode: string | null;
  clicks: number;
  hovers: number;

  constructor(month: string, platform: Platform, countryCode: string | null, clicks: number, hovers: number) {
    this.month = month;
    this.platform = platform;
    this.countryCode = countryCode;
    this.clicks = clicks;
    this.hovers = hovers;
  }
}
