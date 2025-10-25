'use client';

import { Event } from '@/domain/types/event';
import { getUser } from '@/infrastructure/clients/user.client';
import { getUserBattleHistory } from '../../../../infrastructure/clients/history.client';
import { useEffect, useState } from 'react';
import { ReadUserBattleHistoryResponseDto } from '../../../../infrastructure/clients/dtos/history/read-user-battle-history.response.dto';
import { AccordionContent } from '@/components/ui/accordion';
import MatchCard from '../../../../components/comp/match-card';
import moment from 'moment';
import Link from 'next/link';
import { routeEvents } from '../../../../domain/constants/routes';
import { ReadRoundResponseDto } from '../../../../infrastructure/clients/dtos/competition/read-round.response.dto';
import { User } from '../../../../domain/types/user';
import { Competition } from '../../../../domain/types/competition';
import { getCompetition } from '../../../../infrastructure/clients/competition.client';
import { getEvent } from '../../../../infrastructure/clients/event.client';
import { useTranslations } from 'next-intl';
import LoadingSpinner from '../../../../components/animation/loading-spinner';

interface IAccordionContentBattleHistory {
  username: string;
}

const getCompetitionsByBattles = async (
  battleHistory: {
    competitionId: string;
    rounds: ReadRoundResponseDto[];
  }[]
): Promise<Map<string, Competition>> => {
  const competitionsMap: Map<string, Competition> = new Map();
  const requests: Promise<void>[] = [];

  battleHistory.map(data => {
    const req = getCompetition(data.competitionId).then(comp => {
      competitionsMap.set(data.competitionId, comp);
    });

    requests.push(req);
  });

  await Promise.all(requests);
  return competitionsMap;
};

const getUsersByBattles = async (
  battleHistory: {
    competitionId: string;
    rounds: ReadRoundResponseDto[];
  }[]
): Promise<Map<string, User>> => {
  const usersMap: Map<string, User> = new Map();
  const requests: Promise<void>[] = [];

  battleHistory.map(data => {
    data.rounds.map(round => {
      round.matches.map(match => {
        match.matchSlots.map(slot => {
          if (!usersMap.get(slot.name)) {
            const req = getUser(slot.name).then(user => {
              usersMap.set(slot.name, user);
            });
            requests.push(req);
          }
        });
      });
    });
  });

  await Promise.all(requests);
  return usersMap;
};

const getEventsByCompetitions = async (competitionsMap: Map<string, Competition>): Promise<Map<string, Event>> => {
  const eventsMap: Map<string, Event> = new Map();
  const requests: Promise<void>[] = [];

  competitionsMap.forEach(comp => {
    if (comp.eventId) {
      // requests can fail or competitions can behidden. need a smarter approach for the latter.
      try {
        const req = getEvent(comp.eventId)
          .then((event: Event) => {
            if (event.id) {
              eventsMap.set(event.id, event);
            }
          })
          .catch((error: any) => {
            console.error(error.message);
          });

        requests.push(req);
      } catch (error: any) {
        console.error(error.message);
      }
    }
  });
  await Promise.all(requests);
  return eventsMap;
};

export const AccordionContentBattleHistory = ({ username }: IAccordionContentBattleHistory) => {
  const t = useTranslations('/users/username');

  const [battleHistory, setBattleHistory] = useState<ReadUserBattleHistoryResponseDto[]>();
  const [usersMapOfBattles, setUsersMapOfBattles] = useState<Map<string, User>>();
  const [competitionsMapOfBattles, setCompetitionsMapOfBattles] = useState<Map<string, Competition>>();
  const [eventsMapOfCompetitions, setEventsMapOfCompetitions] = useState<Map<string, Event>>();

  useEffect(() => {
    getUserBattleHistory(username).then(res => {
      setBattleHistory(res);
    });
  }, []);

  useEffect(() => {
    // depend on battleHistory
    if (battleHistory) {
      getUsersByBattles(battleHistory).then(res => {
        setUsersMapOfBattles(res);
      });

      getCompetitionsByBattles(battleHistory).then(res => {
        setCompetitionsMapOfBattles(res);
      });
    }
  }, [battleHistory]);

  useEffect(() => {
    // depends on competitionsMapOfBattles
    if (competitionsMapOfBattles)
      getEventsByCompetitions(competitionsMapOfBattles).then(res => {
        setEventsMapOfCompetitions(res);
      });
  }, [competitionsMapOfBattles]);

  if (!battleHistory || !usersMapOfBattles || !competitionsMapOfBattles || !eventsMapOfCompetitions) {
    return (
      <AccordionContent className="flex items-start">
        <LoadingSpinner centerScreen={false} />
      </AccordionContent>
    );
  }

  return (
    <AccordionContent>
      {battleHistory.length === 0 && <div className="flex flex-col">{t('accordionItemCompetitionHistoryNoParticipations')}</div>}

      {battleHistory.length > 0 &&
        battleHistory.map((data, i) => {
          return (
            <div key={`history-data-${i}`} className="mb-2 p-2 flex flex-col border border-secondary-dark rounded-lg">
              <div className="text-lg hover:underline">
                <Link
                  href={`${routeEvents}/${competitionsMapOfBattles.get(data.competitionId)?.eventId}`}
                >{`${eventsMapOfCompetitions.get(competitionsMapOfBattles.get(data.competitionId)?.eventId || '')?.name}`}</Link>
              </div>

              <div className="text-lg hover:underline">
                <Link href={`${routeEvents}/${competitionsMapOfBattles.get(data.competitionId)?.eventId}/comps/${data.competitionId}`}>
                  {`${competitionsMapOfBattles.get(data.competitionId)?.name}`}
                </Link>
              </div>

              {data.rounds.map((round, roundIndex) => {
                return (
                  <div key={`history-round-${i}-${roundIndex}`} className="mt-2 gap-2">
                    {round.matches.map((match, matchIndex) => {
                      return (
                        <div key={`history-match-${i}-${roundIndex}-${matchIndex}`} className="mt-2">
                          <div className="mx-2">
                            <div>{`${round.name} (${moment(round.date).format('YYYY-MM-DD')})`}</div>
                          </div>

                          <MatchCard
                            match={{
                              matchIndex: match.matchIndex,
                              name: match.name,
                              time: moment(match.time).format(),
                              isExtraMatch: match.isExtraMatch,
                              slots: match.slots,
                              matchSlots: match.matchSlots,
                              id: match.id,
                            }}
                            usersMap={usersMapOfBattles}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
    </AccordionContent>
  );
};
