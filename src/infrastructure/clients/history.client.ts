import { ReadUserBattleHistoryResponseDto } from './dtos/history/read-user-battle-history.response.dto';

export async function getUserBattleHistory(username: string): Promise<ReadUserBattleHistoryResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/history/battles/${username}`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}
