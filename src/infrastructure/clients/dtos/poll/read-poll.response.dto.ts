import { ReadPollOptionResponseDto } from './read-poll-option.response.dto';

export class ReadPollResponseDto {
  id: string;
  questioner: string;
  question: string;
  description: string;
  options: ReadPollOptionResponseDto[];
  totalVotes: number;
  creationTime: string;

  constructor(id: string, questioner: string, question: string, description: string, options: ReadPollOptionResponseDto[], totalVotes: number, creationTime: string) {
    this.id = id;
    this.questioner = questioner;
    this.question = question;
    this.description = description;
    this.options = options;
    this.totalVotes = totalVotes;
    this.creationTime = creationTime;
  }
}
