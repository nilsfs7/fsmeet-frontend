export class PatchEventPosterBodyDto {
  posterBase64: string;

  constructor(posterBase64: string) {
    this.posterBase64 = posterBase64;
  }
}
