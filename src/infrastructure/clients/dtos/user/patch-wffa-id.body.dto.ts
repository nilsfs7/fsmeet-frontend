export class PatchWffaIdBodyDto {
  username: string;
  wffaId: string;

  constructor(username: string, wffaId: string) {
    this.username = username;
    this.wffaId = wffaId;
  }
}
