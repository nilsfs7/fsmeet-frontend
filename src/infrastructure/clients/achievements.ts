import { defaultHeaders } from './default-headers';
import { ReadAchievementResponseDto } from './dtos/achievements/read-achievement.response.dto';

export async function getAchievements(username: string): Promise<ReadAchievementResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/achievements/${username}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
    },
  });
  return await response.json();
}
