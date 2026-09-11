'use client';

import { Event } from '@/domain/types/event';
import { getUser } from '@/infrastructure/clients/user.client';
import { getUserBattleHistory } from '@/infrastructure/clients/history.client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReadUserBattleHistoryResponseDto } from '@/infrastructure/clients/dtos/history/read-user-battle-history.response.dto';
import MatchCard from '@/components/comp/match-card';
import moment from 'moment';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import { User } from '@/domain/types/user';
import { Competition } from '@/domain/types/competition';
import { getCompetition } from '@/infrastructure/clients/competition.client';
import { getEvent } from '@/infrastructure/clients/event.client';
import { useTranslations } from 'next-intl';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PREVIEW_COUNT = 3;

interface ProfileCompetitionHistoryProps {
  username: string;
}

async function fetchCompetitions(competitionIds: string[], existing: Map<string, Competition>): Promise<Map<string, Competition>> {
  const next = new Map(existing);
  const missing = competitionIds.filter(id => !next.has(id));
  await Promise.all(
    missing.map(async id => {
      try {
        const comp = await getCompetition(id);
        next.set(id, comp);
      } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : error);
      }
    }),
  );
  return next;
}

async function fetchEvents(competitions: Map<string, Competition>, existing: Map<string, Event>): Promise<Map<string, Event>> {
  const next = new Map(existing);
  const requests: Promise<void>[] = [];

  competitions.forEach(comp => {
    if (!comp.eventId || next.has(comp.eventId)) return;
    requests.push(
      getEvent(comp.eventId)
        .then(event => {
          if (event.id) next.set(event.id, event);
        })
        .catch((error: unknown) => {
          console.error(error instanceof Error ? error.message : error);
        }),
    );
  });

  await Promise.all(requests);
  return next;
}

async function fetchUsersForCompetitions(
  battleHistory: ReadUserBattleHistoryResponseDto[],
  competitionIds: string[],
  existing: Map<string, User>,
): Promise<Map<string, User>> {
  const next = new Map(existing);
  const pending = new Set<string>();
  const selected = battleHistory.filter(entry => competitionIds.includes(entry.competitionId));
  const requests: Promise<void>[] = [];

  selected.forEach(entry => {
    entry.rounds.forEach(round => {
      round.matches.forEach(match => {
        match.matchSlots.forEach(slot => {
          if (next.has(slot.name) || pending.has(slot.name)) return;
          pending.add(slot.name);
          requests.push(
            getUser(slot.name)
              .then(user => {
                next.set(slot.name, user);
              })
              .catch((error: unknown) => {
                console.error(error instanceof Error ? error.message : error);
              }),
          );
        });
      });
    });
  });

  await Promise.all(requests);
  return next;
}

function getLatestRoundDate(entry: ReadUserBattleHistoryResponseDto): string | null {
  let latestMs: number | null = null;
  entry.rounds.forEach(round => {
    if (!round.date) return;
    const ms = moment(round.date).valueOf();
    if (latestMs === null || ms > latestMs) {
      latestMs = ms;
    }
  });
  return latestMs === null ? null : moment(latestMs).format('YYYY-MM-DD');
}

export function ProfileCompetitionHistory({ username }: ProfileCompetitionHistoryProps) {
  const t = useTranslations('/users/username');

  const [battleHistory, setBattleHistory] = useState<ReadUserBattleHistoryResponseDto[]>();
  const [showAll, setShowAll] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [competitionsMap, setCompetitionsMap] = useState<Map<string, Competition>>(new Map());
  const [eventsMap, setEventsMap] = useState<Map<string, Event>>(new Map());
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map());
  const [metaLoading, setMetaLoading] = useState(false);
  const [detailsLoadingIds, setDetailsLoadingIds] = useState<Set<string>>(new Set());
  const [loadedDetailIds, setLoadedDetailIds] = useState<Set<string>>(new Set());

  const competitionsRef = useRef(competitionsMap);
  const eventsRef = useRef(eventsMap);
  const usersRef = useRef(usersMap);
  competitionsRef.current = competitionsMap;
  eventsRef.current = eventsMap;
  usersRef.current = usersMap;

  useEffect(() => {
    getUserBattleHistory(username).then(res => {
      setBattleHistory(res);
    });
  }, [username]);

  const visibleHistory = useMemo(() => {
    if (!battleHistory) return [];
    return showAll ? battleHistory : battleHistory.slice(0, PREVIEW_COUNT);
  }, [battleHistory, showAll]);

  const visibleCompetitionIdsKey = visibleHistory.map(entry => entry.competitionId).join('|');
  const expandedIdsKey = Array.from(expandedIds).sort().join('|');

  useEffect(() => {
    if (!battleHistory || !visibleCompetitionIdsKey) return;

    const visibleCompetitionIds = visibleCompetitionIdsKey.split('|').filter(Boolean);
    let cancelled = false;
    setMetaLoading(true);

    (async () => {
      const competitions = await fetchCompetitions(visibleCompetitionIds, competitionsRef.current);
      if (cancelled) return;
      setCompetitionsMap(competitions);

      const events = await fetchEvents(competitions, eventsRef.current);
      if (cancelled) return;
      setEventsMap(events);
      setMetaLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [battleHistory, visibleCompetitionIdsKey]);

  useEffect(() => {
    if (!battleHistory || !expandedIdsKey) return;

    const ids = expandedIdsKey.split('|').filter(Boolean);
    let cancelled = false;

    setDetailsLoadingIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });

    (async () => {
      const users = await fetchUsersForCompetitions(battleHistory, ids, usersRef.current);
      if (cancelled) return;
      setUsersMap(users);
      setLoadedDetailIds(prev => {
        const next = new Set(prev);
        ids.forEach(id => next.add(id));
        return next;
      });

      setDetailsLoadingIds(prev => {
        const next = new Set(prev);
        ids.forEach(id => next.delete(id));
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [battleHistory, expandedIdsKey]);

  const toggleExpanded = (competitionId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(competitionId)) {
        next.delete(competitionId);
      } else {
        next.add(competitionId);
      }
      return next;
    });
  };

  if (!battleHistory) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">{t('accordionItemCompetitionHistory')}</h2>
        <LoadingSpinner centerScreen={false} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">
        {t('accordionItemCompetitionHistory')}
        {battleHistory.length > 0 && <span className="ml-2 text-sm font-normal text-muted-foreground">({battleHistory.length})</span>}
      </h2>

      {battleHistory.length === 0 && <div>{t('accordionItemCompetitionHistoryNoParticipations')}</div>}

      {battleHistory.length > 0 && (
        <div className="flex flex-col gap-2">
          {metaLoading && competitionsMap.size === 0 && <LoadingSpinner centerScreen={false} />}

          {visibleHistory.map(entry => {
            const competition = competitionsMap.get(entry.competitionId);
            const event = competition?.eventId ? eventsMap.get(competition.eventId) : undefined;
            const latestDate = getLatestRoundDate(entry);
            const isExpanded = expandedIds.has(entry.competitionId);
            const detailsReady = loadedDetailIds.has(entry.competitionId);
            const isDetailsLoading = detailsLoadingIds.has(entry.competitionId) && !detailsReady;

            return (
              <div key={entry.competitionId} className="flex flex-col rounded-lg border border-secondary-dark">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 p-3 text-left hover:bg-muted/40"
                  onClick={() => toggleExpanded(entry.competitionId)}
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {event?.name && competition?.eventId ? (
                        <Link href={`${routeEvents}/${competition.eventId}`} className="hover:underline" onClick={e => e.stopPropagation()}>
                          {event.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">…</span>
                      )}
                    </div>
                    <div className="truncate text-sm">
                      {competition?.name && competition.eventId ? (
                        <Link
                          href={`${routeEvents}/${competition.eventId}/comps/${entry.competitionId}`}
                          className="hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          {competition.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">…</span>
                      )}
                    </div>
                    {latestDate && <div className="mt-1 text-xs text-muted-foreground">{latestDate}</div>}
                  </div>
                  {isExpanded ? <ChevronUp className="mt-1 h-4 w-4 shrink-0" /> : <ChevronDown className="mt-1 h-4 w-4 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-secondary-dark p-3">
                    {isDetailsLoading && <LoadingSpinner centerScreen={false} />}

                    {detailsReady &&
                      entry.rounds.map((round, roundIndex) => (
                        <div key={`history-round-${entry.competitionId}-${roundIndex}`} className="mt-2 first:mt-0">
                          {round.matches.map((match, matchIndex) => (
                            <div key={`history-match-${entry.competitionId}-${roundIndex}-${matchIndex}`} className="mt-2 first:mt-0">
                              <div className="mx-2 mb-1 text-sm">{`${round.name} (${moment(round.date).format('YYYY-MM-DD')})`}</div>
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
                                usersMap={usersMap}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}

          {battleHistory.length > PREVIEW_COUNT && (
            <Button type="button" variant="outline" className="w-full self-center sm:w-auto" onClick={() => setShowAll(prev => !prev)}>
              {showAll ? t('competitionHistoryShowLess') : t('competitionHistoryShowAll', { count: battleHistory.length })}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
