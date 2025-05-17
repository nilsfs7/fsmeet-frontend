export class ReadUserCountOnMapResponseDto {
  userCountOnMap: number;
  userCount: number;

  constructor(userCountOnMap: number, userCount: number) {
    this.userCountOnMap = userCountOnMap;
    this.userCount = userCount;
  }
}
