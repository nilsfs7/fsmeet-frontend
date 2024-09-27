import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SocialLink from '@/components/user/SocialLink';
import { imgUserDefaultImg, imgVerifiedCheckmark, imgWorld } from '@/domain/constants/images';
import { routeAccount, routeEvents, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Platform } from '@/domain/enums/platform';
import { UserType } from '@/domain/enums/user-type';
import { User } from '@/types/user';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { countries } from 'countries-list';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { Header } from '@/components/Header';
import { auth } from '@/auth';
import { getUserBattleHistory } from '@/infrastructure/clients/history.client';
import MatchCard from '@/components/comp/MatchCard';
import moment from 'moment';
import { Event } from '@/types/event';
import { ReadCompetitionResponseDto } from '@/infrastructure/clients/dtos/read-competition.reposnse.dto';
import { deleteUser, getUser } from '@/infrastructure/clients/user.client';
import { getEvent } from '@/infrastructure/clients/event.client';
import { TechnicalUser } from '@/domain/enums/technical-user';
import { Toaster, toast } from 'sonner';
import { getTotalMatchPerformance } from '@/infrastructure/clients/statistic.client';
import { getCompetition } from '@/infrastructure/clients/competition.client';
import NavigateBackButton from '@/components/NavigateBackButton';
import { ReadRoundResponseDto } from '@/infrastructure/clients/dtos/read-round.response.dto';

const getCompetitionsByBattles = async (
  battleHistory: {
    competitionId: string;
    rounds: ReadRoundResponseDto[];
  }[]
): Promise<Map<string, ReadCompetitionResponseDto>> => {
  const competitionsMap: Map<string, ReadCompetitionResponseDto> = new Map();
  const requests: Promise<void>[] = [];

  battleHistory.map((data) => {
    const req = getCompetition(data.competitionId).then((comp) => {
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

  battleHistory.map((data) => {
    data.rounds.map((round) => {
      round.matches.map((match) => {
        match.matchSlots.map((slot) => {
          if (!usersMap.get(slot.name)) {
            const req = getUser(slot.name).then((user) => {
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

const getEventsByCompetitions = async (competitionsMap: Map<string, ReadCompetitionResponseDto>): Promise<Map<string, Event>> => {
  const eventsMap: Map<string, Event> = new Map();
  const requests: Promise<void>[] = [];

  competitionsMap.forEach((comp) => {
    if (comp.eventId) {
      const req = getEvent(comp.eventId).then((event: Event) => {
        if (event.id) {
          eventsMap.set(event.id, event);
        }
      });

      requests.push(req);
    }
  });
  await Promise.all(requests);
  return eventsMap;
};

export default async function PublicUserProfile({ params }: { params: { username: string } }) {
  const session = await auth();

  const user = await getUser(params.username.toString());
  const matchStats = await getTotalMatchPerformance(params.username.toString());
  const battleHistory = await getUserBattleHistory(params.username.toString());

  const usersMapOfBattles = await getUsersByBattles(battleHistory);
  const competitionsMapOfBattles = await getCompetitionsByBattles(battleHistory);
  const eventsMapOfCompetitions = await getEventsByCompetitions(competitionsMapOfBattles);

  let displayName = user.firstName ? `${user.firstName}` : `${user.username}`;
  if (user.lastName) {
    displayName = `${displayName}`;
  }

  function getCountryNameByCode(code: string): string {
    // @ts-ignore: next-line
    const country = countries[code.toUpperCase()];
    return country ? country.name : null;
  }

  async function handleDeleteAccountClicked() {
    try {
      await deleteUser(user.username, session);

      toast.success('User deleted.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <div className="h-full overflow-y-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="w-64">
              <div className="mt-6 flex h-96">
                <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
              </div>

              <div className="mx-2 mt-6">
                <div className="flex items-start gap-1 text-lg">
                  {user.verificationState === UserVerificationState.VERIFIED && (
                    <div className="h-6 w-6 hover:p-0.5 flex items-center">
                      <img className="" src={imgVerifiedCheckmark} alt="user verified checkmark" />
                    </div>
                  )}

                  <div className="w-fit">
                    {user.nickName && <div>{user.nickName}</div>}
                    {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                    {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                  </div>
                </div>

                {user.type && user.type !== UserType.FREESTYLER && (
                  <div className="flex items-start gap-1 mt-1">
                    <div className="w-6 hover:p-0.5">
                      <img src={getUserTypeImages(user.type).path} className="rounded-full object-cover" />
                    </div>

                    <div className="w-fit">{getUserTypeLabels(user.type)}</div>
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
                      <Link href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}`}>
                        <img src={imgWorld} className="rounded-full object-cover" />
                      </Link>
                    </div>

                    <div className="w-fit">
                      <Link className="hover:underline" href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}`}>
                        {user.city}
                      </Link>
                    </div>
                  </div>
                )}

                <Accordion className="mt-1" type="single" collapsible>
                  {(user.instagramHandle || user.tikTokHandle || user.youTubeHandle || user.website) && (
                    <AccordionItem value="item-socials">
                      <AccordionTrigger>{`Socials`}</AccordionTrigger>
                      <AccordionContent>
                        <div className="">
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

                  {user.type === UserType.FREESTYLER && (
                    <AccordionItem value="item-matches">
                      <AccordionTrigger>{`Battle Statistics`}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2">
                          <div>{`Matches`}</div>
                          <div>{matchStats.matches}</div>

                          {matchStats.matches > 0 && (
                            <>
                              <div>{`Wins`}</div>
                              <div>{`${matchStats.wins} `}</div>

                              <div>{`Win ratio`}</div>
                              <div>{`${(matchStats.ratio * 100).toFixed(2)}%`}</div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {user.type === UserType.FREESTYLER && (
                    <AccordionItem value="item-history">
                      <AccordionTrigger>{`Competition History`}</AccordionTrigger>
                      <AccordionContent>
                        {battleHistory.length === 0 && <div className="flex flex-col">{`No participations, yet.`}</div>}

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
            {session?.user?.username === TechnicalUser.ADMIN && <ActionButton action={Action.DELETE} onClick={handleDeleteAccountClicked} />}

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
