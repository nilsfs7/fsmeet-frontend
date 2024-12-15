export class ReadPollOptionResponseDto {
  option: string;
  numVotes: number;

  constructor(option: string, numVotes: number) {
    this.option = option;
    this.numVotes = numVotes;
  }
}
