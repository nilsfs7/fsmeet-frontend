import { ReadUserBattleHistoryResponseDto } from './dtos/read-user-battle-history.response.dto';

// TODO: cleanup if not needed
// export async function getUserBattleHistory(username: string): Promise<{ competitionId: string; rounds: Round[] }[]> {
//   const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/history/battles/${username}`;

//   const response = await fetch(url, {
//     method: 'GET',
//   });
//   const battleData: ReadUserBattleHistoryResponseDto[] = await response.json();

//   const data = battleData.map((data) => {
//     const rounds: Round[] = data.rounds.map((rnd: ReadRoundResponseDto) => {
//       const round = new Round(rnd.roundIndex, rnd.name, moment(rnd.date).format(), rnd.advancingTotal);

//       round.matches = rnd.matches.map((match) => {
//         return new Match(match.matchIndex, match.name, moment(match.time).format(), match.isExtraMatch, match.slots, match.matchSlots, match.id);
//       });

//       const matches: Match[] = round.matches.map((mtch) => {
//         return new Match(mtch.matchIndex, mtch.name, mtch.time, mtch.isExtraMatch, mtch.slots, mtch.matchSlots, mtch.id);
//       });

//       round.matches = matches;

//       return round;
//     });

//     return { competitionId: data.competitionId, rounds };
//   });

//   return data;
// }

export async function getUserBattleHistory(username: string): Promise<ReadUserBattleHistoryResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/history/battles/${username}`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}
