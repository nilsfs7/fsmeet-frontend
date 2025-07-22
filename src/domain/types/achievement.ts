import { AchievementLevel } from '@/domain/enums/achievement-level';

export type Achievement = {
  name: string;
  description: string;
  imageUrl: string;
  achievementTimes: string;
  level: AchievementLevel;
};
