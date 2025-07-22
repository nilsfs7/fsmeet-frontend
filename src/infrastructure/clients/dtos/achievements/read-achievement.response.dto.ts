import { Moment } from 'moment';
import { AchievementLevel } from '../../../../domain/enums/achievement-level';

export class ReadAchievementResponseDto {
  name: string;
  description: string;
  imageUrl: string;
  achievementTimes: Moment[];
  level: AchievementLevel;

  constructor(name: string, description: string, imageUrl: string, achievementTimes: Moment[], level: AchievementLevel) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.achievementTimes = achievementTimes;
    this.level = level;
  }
}
