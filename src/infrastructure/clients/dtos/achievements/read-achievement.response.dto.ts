import { Moment } from 'moment';

export class ReadAchievementResponseDto {
  name: string;
  description: string;
  imageUrl: string;
  achievementTimes: Moment[];

  constructor(name: string, description: string, imageUrl: string, achievementTimes: Moment[]) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.achievementTimes = achievementTimes;
  }
}
