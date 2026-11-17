import { AchievementLevel } from '../../../../domain/enums/achievement-level';

export class ReadAchievementResponseDto {
  name: string;
  description: string;
  imageUrl: string;
  achievementTimes: string[];
  level: AchievementLevel;

  constructor(name: string, description: string, imageUrl: string, achievementTimes: string[], level: AchievementLevel) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.achievementTimes = achievementTimes;
    this.level = level;
  }
}
