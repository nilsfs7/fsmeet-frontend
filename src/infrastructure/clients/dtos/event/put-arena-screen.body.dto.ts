export class PutArenaScreenBodyDto {
  activeMatchId: string | null;
  backgroundImageUrl: string | null;
  backgroundOverlayOpacity: number | null;
  showPositions: boolean;
  reversePositionLabels: boolean;
  showFlags: boolean;

  constructor(activeMatchId: string | null, backgroundImageUrl: string | null, backgroundOverlayOpacity: number | null, showPositions: boolean, reversePositionLabels: boolean, showFlags: boolean) {
    this.activeMatchId = activeMatchId;
    this.backgroundImageUrl = backgroundImageUrl;
    this.backgroundOverlayOpacity = backgroundOverlayOpacity;
    this.showPositions = showPositions;
    this.reversePositionLabels = reversePositionLabels;
    this.showFlags = showFlags;
  }
}
