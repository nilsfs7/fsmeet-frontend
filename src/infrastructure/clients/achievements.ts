import { ReadAchievementResponseDto } from './dtos/achievements/read-achievement.response.dto';

export async function getAchievements(username: string): Promise<ReadAchievementResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/achievements/${username}`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}
