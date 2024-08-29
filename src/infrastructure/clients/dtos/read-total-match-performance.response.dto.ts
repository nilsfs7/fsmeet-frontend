export class ReadTotalMatchPerfromanceResponseDto {
  username: string;
  matches: number;
  wins: number;
  losses: number;
  ratio: number;

  constructor(username: string, matches: number, wins: number, losses: number, ratio: number) {
    this.username = username;
    this.matches = matches;
    this.wins = wins;
    this.losses = losses;
    this.ratio = ratio;
  }
}
