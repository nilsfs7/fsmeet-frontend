import { Match } from '@/types/match';
import { Round } from '@/types/round';

export async function getRounds(compId: string): Promise<Round[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const response = await fetch(url);
  const rnds: Round[] = await response.json();

  const rounds: Round[] = rnds.map((rnd: Round) => {
    const round = new Round(rnd.roundIndex, rnd.name, rnd.advancingTotal);
    // round.passingExtra = rnd.passingExtra;
    // round.passingPerMatch = rnd.passingPerMatch;
    round.matches = rnd.matches;

    let matches: Match[] = round.matches.map((mtch) => {
      return new Match(mtch.matchIndex, mtch.name, mtch.isExtraMatch, mtch.slots, mtch.matchSlots, mtch.time, mtch.id);
    });

    matches = matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1)); // override auto generated matches (TODO: geht besser) TODO #2: keine ahnung ob das hier überhaupt noch gebraucht wird
    round.matches = matches;

    return round;
  });

  return rounds;
}
