import { ReadPollOptionResponseDto } from './read-poll-option.response.dto';

export class ReadPollResponseDto {
  id: string;
  questioner: string;
  question: string;
  options: ReadPollOptionResponseDto[];
  totalVotes: number;
  creationTime: string;

  constructor(id: string, question: string, questioner: string, options: ReadPollOptionResponseDto[], totalVotes: number, creationTime: string) {
    this.id = id;
    this.question = question;
    this.questioner = questioner;
    this.options = options;
    this.totalVotes = totalVotes;
    this.creationTime = creationTime;
  }
}
