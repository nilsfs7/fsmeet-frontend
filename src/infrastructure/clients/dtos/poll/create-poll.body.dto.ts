import { CreatePollOptionBodyDto } from './create-poll-option.body.dto';

export class CreatePollBodyDto {
  question: string;
  options: CreatePollOptionBodyDto[];

  constructor(question: string, options: CreatePollOptionBodyDto[]) {
    this.question = question;
    this.options = options;
  }
}
