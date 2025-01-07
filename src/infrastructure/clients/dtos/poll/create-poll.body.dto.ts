import { CreatePollOptionBodyDto } from './create-poll-option.body.dto';
import { Moment } from 'moment';
import { CreateTargetGroupBodyDto } from './create-target-group.body.dto';

export class CreatePollBodyDto {
  question: string;
  description: string;
  options: CreatePollOptionBodyDto[];
  deadline: Moment | null;
  targetGroup: CreateTargetGroupBodyDto;

  constructor(question: string, description: string, options: CreatePollOptionBodyDto[], deadline: Moment | null, targetGroup: CreateTargetGroupBodyDto) {
    this.question = question;
    this.description = description;
    this.options = options;
    this.deadline = deadline;
    this.targetGroup = targetGroup;
  }
}
