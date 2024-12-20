import { ReadPollOptionResponseDto } from './read-poll-option.response.dto';

export class ReadPollResponseDto {
  id: string;
  questioner: string;
  question: string;
  options: ReadPollOptionResponseDto[];
  totalVotes: number;

  constructor(id: string, question: string, questioner: string, options: ReadPollOptionResponseDto[], totalVotes: number) {
    this.id = id;
    this.question = question;
    this.questioner = questioner;
    this.options = options;
    this.totalVotes = totalVotes;
  }
}
