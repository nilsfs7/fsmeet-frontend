export class PutArenaScreenBodyDto {
  activeMatchId: string | null;
  backgroundOverlayOpacity: number | null;
  showPositions: boolean;
  reversePositionLabels: boolean;
  showFlags: boolean;
  showLastName: boolean;

  constructor(activeMatchId: string | null, backgroundOverlayOpacity: number | null, showPositions: boolean, reversePositionLabels: boolean, showFlags: boolean, showLastName: boolean) {
    this.activeMatchId = activeMatchId;
    this.backgroundOverlayOpacity = backgroundOverlayOpacity;
    this.showPositions = showPositions;
    this.reversePositionLabels = reversePositionLabels;
    this.showFlags = showFlags;
    this.showLastName = showLastName;
  }
}
