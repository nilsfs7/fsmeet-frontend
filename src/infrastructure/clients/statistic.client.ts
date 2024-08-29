import { ReadTotalMatchPerfromanceResponseDto } from './dtos/read-total-match-performance.response.dto';
import { ReadUserCountResponseDto } from './dtos/read-user-count.response.dto';

export async function getUserCount(): Promise<ReadUserCountResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/users/count`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching user count.`);
  }
}

export async function getTotalMatchPerformance(username: string): Promise<ReadTotalMatchPerfromanceResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/matches/${username}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching total match performance.`);
  }
}
