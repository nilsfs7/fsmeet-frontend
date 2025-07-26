import { ReadEventCountResponseDto } from './dtos/event/read-event-count.response.dto';
import { ReadUserGrowthResponseDto } from './dtos/event/read-user-growth.response.dto';
import { ReadTotalMatchPerfromanceResponseDto } from './dtos/statistics/read-total-match-performance.response.dto';
import { ReadUserCountOnMapResponseDto } from './dtos/statistics/read-user-count-on-map.response.dto';
import { ReadUserCountResponseDto } from './dtos/statistics/read-user-count.response.dto';
import { ReadUserNationalityCountResponseDto } from './dtos/statistics/read-user-nationality-count.response.dto';

export async function getUserCountByType(): Promise<ReadUserCountResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/users/count/type`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching user count by user type.`);
  }
}

export async function getUserCountByNationality(): Promise<ReadUserNationalityCountResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/users/count/nationality`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching user count by nationality.`);
  }
}

export async function getUserCountOnMap(): Promise<ReadUserCountOnMapResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/users/count/map`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching user count on map.`);
  }
}

export async function getUserGrowth(): Promise<ReadUserGrowthResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/users/growth`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching user growth.`);
  }
}

export async function getEventCount(): Promise<ReadEventCountResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/events/count`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching event count.`);
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
