export class CreatePollOptionBodyDto {
  option: string;

  constructor(option: string) {
    this.option = option;
  }
}
