import { CreatePollOptionBodyDto } from './create-poll-option.body.dto';
import { Moment } from 'moment';

export class CreatePollBodyDto {
  question: string;
  options: CreatePollOptionBodyDto[];
  deadline: Moment | null;

  constructor(question: string, options: CreatePollOptionBodyDto[], deadline: Moment | null) {
    this.question = question;
    this.options = options;
    this.deadline = deadline;
  }
}
