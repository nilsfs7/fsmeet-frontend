export class ReadArenaScreenStyleResponseDto {
  backgroundImageUrl: string;
  backgroundOverlayOpacity: number;
  showPositions: boolean;
  reversePositionLabels: boolean;
  showFlags: boolean;
  showLastName: boolean;

  constructor(backgroundImageUrl: string, backgroundOverlayOpacity: number, showPositions: boolean, reversePositionLabels: boolean, showFlags: boolean, showLastName: boolean) {
    this.backgroundImageUrl = backgroundImageUrl;
    this.backgroundOverlayOpacity = backgroundOverlayOpacity;
    this.showPositions = showPositions;
    this.reversePositionLabels = reversePositionLabels;
    this.showFlags = showFlags;
    this.showLastName = showLastName;
  }
}
