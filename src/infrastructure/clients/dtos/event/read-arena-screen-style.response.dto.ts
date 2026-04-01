export class ReadArenaScreenStyleResponseDto {
  backgroundImageUrl: string;
  backgroundOverlayOpacity: number;
  showPositions: boolean;
  reversePositionLabels: boolean;
  showFlags: boolean;

  constructor(backgroundImageUrl: string, backgroundOverlayOpacity: number, showPositions: boolean, reversePositionLabels: boolean, showFlags: boolean) {
    this.backgroundImageUrl = backgroundImageUrl;
    this.backgroundOverlayOpacity = backgroundOverlayOpacity;
    this.showPositions = showPositions;
    this.reversePositionLabels = reversePositionLabels;
    this.showFlags = showFlags;
  }
}
