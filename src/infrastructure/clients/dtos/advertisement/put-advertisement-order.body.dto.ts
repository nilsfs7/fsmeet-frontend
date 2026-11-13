export class PutAdvertisementOrderBodyDto {
  advertisementIds: string[];

  constructor(advertisementIds: string[]) {
    this.advertisementIds = advertisementIds;
  }
}
