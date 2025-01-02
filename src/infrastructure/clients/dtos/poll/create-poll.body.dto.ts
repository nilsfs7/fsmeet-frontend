import { CreatePollOptionBodyDto } from './create-poll-option.body.dto';
import { Moment } from 'moment';
import { CreateTargetGroupBodyDto } from './create-target-group.body.dto';

export class CreatePollBodyDto {
  question: string;
  options: CreatePollOptionBodyDto[];
  deadline: Moment | null;
  targetGroup: CreateTargetGroupBodyDto;

  constructor(question: string, options: CreatePollOptionBodyDto[], deadline: Moment | null, targetGroup: CreateTargetGroupBodyDto) {
    this.question = question;
    this.options = options;
    this.deadline = deadline;
    this.targetGroup = targetGroup;
  }
}
