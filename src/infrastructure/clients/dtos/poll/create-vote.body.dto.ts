export class CreateVoteBodyDto {
  optionIndex: number;

  constructor(optionIndex: number) {
    this.optionIndex = optionIndex;
  }
}
