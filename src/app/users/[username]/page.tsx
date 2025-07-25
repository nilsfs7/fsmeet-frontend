import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SocialLink from '@/components/user/SocialLink';
import { imgUserDefaultImg, imgVerifiedCheckmark, imgWorld } from '@/domain/constants/images';
import { routeAccount, routeEvents, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Platform } from '@/domain/enums/platform';
import { UserType } from '@/domain/enums/user-type';
import { User } from '@/domain/types/user';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { Header } from '@/components/Header';
import { auth } from '@/auth';
import { getUserBattleHistory } from '@/infrastructure/clients/history.client';
import MatchCard from '@/components/comp/MatchCard';
import moment from 'moment';
import { Event } from '@/domain/types/event';
import { getUser } from '@/infrastructure/clients/user.client';
import { getEvent } from '@/infrastructure/clients/event.client';
import { TechnicalUser } from '@/domain/enums/technical-user';
import { getTotalMatchPerformance } from '@/infrastructure/clients/statistic.client';
import { getCompetition } from '@/infrastructure/clients/competition.client';
import NavigateBackButton from '@/components/NavigateBackButton';
import { ReadRoundResponseDto } from '@/infrastructure/clients/dtos/competition/read-round.response.dto';
import { ActionButtonDeleteUser } from './components/action-button-delete-user';
import { getTranslations } from 'next-intl/server';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { Competition } from '@/domain/types/competition';
import { getAchievements } from '@/infrastructure/clients/achievements';
import { AchievementLevel } from '@/domain/enums/achievement-level';

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

const getAchievementStyle = (level: AchievementLevel): string => {
  switch (level) {
    case AchievementLevel.BRONZE:
      return 'border border-bronze shadow-bronze shadow-inner';

    case AchievementLevel.SILVER:
      return 'border border-silver shadow-silver shadow-inner';

    case AchievementLevel.GOLD:
      return 'border border-gold shadow-gold shadow-inner';

    default:
      return '';
  }
};

export default async function PublicUserProfile({ params }: { params: { username: string } }) {
  const t = await getTranslations('/users/username');
  const session = await auth();

  const user = await getUser(params.username.toString());
  const matchStats = await getTotalMatchPerformance(params.username.toString());
  const battleHistory = await getUserBattleHistory(params.username.toString());
  const achievements = await getAchievements(params.username.toString());

  const usersMapOfBattles = await getUsersByBattles(battleHistory);
  const competitionsMapOfBattles = await getCompetitionsByBattles(battleHistory);
  const eventsMapOfCompetitions = await getEventsByCompetitions(competitionsMapOfBattles);

  let displayName = user.firstName ? `${user.firstName}` : `${user.username}`;
  if (user.lastName) {
    displayName = `${displayName}`;
  }

  return (
    <>
      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <div className="h-full overflow-y-auto">
          <div className="flex flex-col items-center justify-center ">
            <div className="w-64">
              <div className="mt-6 flex aspect-[4/5]">
                <img className="h-full w-full object-cover rounded-lg border border-primary shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
              </div>

              <div className="mx-2 mt-6">
                <div className="flex items-start gap-1 text-lg">
                  {user.verificationState === UserVerificationState.VERIFIED && (
                    <div className="h-6 w-6 hover:p-0.5 flex items-center">
                      <img src={imgVerifiedCheckmark} alt="user verified checkmark" />
                    </div>
                  )}

                  <div className="w-fit">
                    {user.nickName && <div>{user.nickName}</div>}
                    {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                    {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                  </div>
                </div>

                {user.type !== UserType.FREESTYLER && (
                  <div className="flex items-start gap-1 mt-1">
                    <div className="w-6 hover:p-0.5">
                      <img src={getUserTypeImages(user.type).path} className="rounded-full object-cover" />
                    </div>

                    <div className="w-fit">{getUserTypeLabels(user.type, t)}</div>
                  </div>
                )}

                {user.country && user.country != '--' && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex w-6 hover:p-0.5">
                      <ReactCountryFlag
                        countryCode={user.country}
                        svg
                        style={{
                          width: '100%',
                        }}
                        title={user.country}
                      />
                    </div>

                    <div>{getCountryNameByCode(user.country)}</div>
                  </div>
                )}

                {user.city && (
                  <div className="flex items-start gap-1 mt-1">
                    <div className="w-6 hover:p-0.5">
                      <Link href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                        <img src={imgWorld} className="rounded-full object-cover" />
                      </Link>
                    </div>

                    <div className="w-fit">
                      <Link className="hover:underline" href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                        {user.city}
                      </Link>
                    </div>
                  </div>
                )}

                <Accordion className="mt-1" type="single" collapsible>
                  {(user.instagramHandle || user.tikTokHandle || user.youTubeHandle || user.website) && (
                    <AccordionItem value="item-socials">
                      <AccordionTrigger>{t('accordionItemSocials')}</AccordionTrigger>
                      <AccordionContent>
                        <div>
                          {user.instagramHandle && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.INSTAGRAM} path={user.instagramHandle} />
                            </div>
                          )}

                          {user.tikTokHandle && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.TIKTOK} path={user.tikTokHandle} />
                            </div>
                          )}

                          {user.youTubeHandle && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.YOUTUBE} path={user.youTubeHandle} />
                            </div>
                          )}

                          {user.website && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.WEBSITE} path={user.website} />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* todo: enable for all users */}
                  {(session?.user.username === 'nils' || session?.user.username === 'showballs' || session?.user.username === 'wffa' || session?.user.username === 'jay_vng') &&
                    achievements.length > 0 && (
                      <AccordionItem value="item-achievements">
                        <AccordionTrigger>{t('accordionItemAchievements')}</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-3 justify-center gap-2">
                            {achievements.map((achievement, i) => {
                              return (
                                <div key={`achievement-${i}`} className="flex flex-col items-center w-16 justify-self-centers">
                                  <img src={achievement.imageUrl} className={`h-12 w-12 rounded-full object-cover ${getAchievementStyle(achievement.level)}`} alt={achievement.name} />

                                  <div className="text-xs text-center">{achievement.name}</div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                  {user.type === UserType.FREESTYLER && (
                    <AccordionItem value="item-matches">
                      <AccordionTrigger>{t('accordionItemBattleStatistics')}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2">
                          <div>{t('accordionItemBattleStatisticsAmountBattles')}</div>
                          <div>{matchStats.matches}</div>

                          {matchStats.matches > 0 && (
                            <>
                              <div>{t('accordionItemBattleStatisticsAmountWins')}</div>
                              <div>{`${matchStats.wins} `}</div>

                              <div>{t('accordionItemBattleStatisticsWinLossRatio')}</div>
                              <div>{`${(matchStats.ratio * 100).toFixed(2)}%`}</div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {user.type === UserType.FREESTYLER && (
                    <AccordionItem value="item-history">
                      <AccordionTrigger>{t('accordionItemCompetitionHistory')}</AccordionTrigger>
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
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <Navigation>
          <NavigateBackButton />

          <div className="flex justify-end gap-1">
            {session?.user?.username === TechnicalUser.ADMIN && <ActionButtonDeleteUser username={user.username} />}

            {session?.user?.username === user.username && (
              <Link href={routeAccount}>
                <ActionButton action={Action.EDIT} />
              </Link>
            )}
          </div>
        </Navigation>
      </div>
    </>
  );
}
