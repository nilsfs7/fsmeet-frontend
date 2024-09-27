import { Competition } from '@/types/competition';
import { Round } from '@/domain/classes/round';
import { Session } from 'next-auth';
import { ReadCompetitionResponseDto } from './dtos/read-competition.reposnse.dto';
import { Match } from '@/domain/classes/match';

export async function getCompetition(compId: string): Promise<ReadCompetitionResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.info('Getting competition successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getCompetitionParticipants(compId: string): Promise<{ username: string }[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;

  const response = await fetch(url, { method: 'GET' });
  return await response.json();
}

export async function getRounds(compId: string): Promise<Round[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const response = await fetch(url, { method: 'GET' });
  const rnds: Round[] = await response.json();

  const rounds: Round[] = rnds.map((rnd: Round) => {
    const round = new Round(rnd.roundIndex, rnd.name, rnd.date, rnd.advancingTotal);
    round.matches = rnd.matches;

    let matches: Match[] = round.matches.map((mtch) => {
      return new Match(mtch.matchIndex, mtch.name, mtch.time, mtch.isExtraMatch, mtch.slots, mtch.matchSlots, mtch.id);
    });

    matches = matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1)); // override auto generated matches (TODO: geht besser) TODO #2: keine ahnung ob das hier überhaupt noch gebraucht wird
    round.matches = matches;

    return round;
  });

  return rounds;
}

export async function createCompetition(eventId: string, comp: Competition, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions`;

  const body = JSON.stringify({
    eventId: eventId,
    name: comp?.name.trim(),
    type: comp.type,
    gender: comp.gender,
    maxAge: comp?.maxAge,
    description: comp?.description.trim(),
    rules: comp?.rules.trim(),
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating competition successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createCompetitionParticipation(compId: string, username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;

  const body = JSON.stringify({
    username: `${username}`,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating competition participation successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createRounds(compId: string, rounds: Round[], session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const body = JSON.stringify({
    rounds: rounds,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating rounds successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateCompetition(comp: Competition, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions`;

  const body = JSON.stringify({
    id: comp.id,
    name: comp?.name.trim(),
    maxAge: comp?.maxAge,
    description: comp?.description.trim(),
    rules: comp?.rules.trim(),
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating competition successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateRounds(compId: string, rounds: Round[], session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const body = JSON.stringify(rounds);

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating rounds successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateMatchSlots(eventId: string, compId: string, matchId: string, slotIndex: number, username: string, result: number | undefined, session: Session | null): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/matches/${matchId}/slots`;

  const body = JSON.stringify({
    eventId: eventId,
    slotIndex: slotIndex,
    name: username,
    result: result,
  });

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info(`match ${matchId} updated.`);
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
  return response;
}

export async function deleteCompetition(compId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions`;

  const body = JSON.stringify({
    id: `${compId}`,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting competition successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteCompetitionParticipation(compId: string, username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;

  const body = JSON.stringify({
    username: `${username}`,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Removing competition participation successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteRounds(compId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting rounds successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
