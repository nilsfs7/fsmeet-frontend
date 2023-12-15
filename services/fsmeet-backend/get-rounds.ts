import moment from 'moment';
import { Round } from '@/types/round';
import { Match } from '@/types/match';

export async function getRounds(compId: string): Promise<Round[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`);
  const rnds: Round[] = await response.json();

  const rounds: Round[] = rnds.map((rnd: Round) => {
    const round = new Round(rnd.roundIndex, rnd.name, rnd.numberPlayers);
    round.passingExtra = rnd.passingExtra;
    round.passingPerMatch = rnd.passingPerMatch;
    round.matches = rnd.matches;

    round.matches = round.matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1)); // override auto generated matches (TODO: geht besser)

    return round;
  });

  return rounds;
}
