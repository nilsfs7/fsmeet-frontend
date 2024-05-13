import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Competition } from '@/types/competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { Event } from '@/types/event';
import Navigation from '@/components/Navigation';
import { User } from '@/types/user';
import { useSearchParams } from 'next/navigation';
import { routeEvents } from '@/types/consts/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BattleList from '@/components/comp/BattleList';
import BattleGrid from '@/components/comp/BattleGrid';
import ParticipantList from '@/components/events/ParticipantList';
import TextareaAutosize from 'react-textarea-autosize';
import { switchTab } from '@/types/funcs/switch-tab';
import { Round } from '@/types/round';
import Separator from '@/components/Seperator';
import { getRounds } from '@/services/fsmeet-backend/get-rounds';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { getCompetitionParticipants } from '@/services/fsmeet-backend/get-competition-participants';
import { validateSession } from '@/types/funcs/validate-session';
import { Switch } from '@/components/ui/switch';
import { getUser } from '@/services/fsmeet-backend/get-user';
import PageTitle from '@/components/PageTitle';
import TextButton from '@/components/common/TextButton';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { AcceptedData, ConfigOptions } from 'export-to-csv/output/lib/types';
import moment from 'moment';
import { MatchSlot } from '@/types/match-slot';
import { Toaster, toast } from 'sonner';

const CompetitionDetails = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const needsAuthorization = searchParams.get('auth');

  const [competitionParticipants, setCompetitionParticipants] = useState<User[]>([]);
  const [comp, setComp] = useState<Competition>();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());
  const [filteredByUser, setFilteredByUser] = useState<string | null>(null);

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      let p: Promise<Event>;

      if (!needsAuthorization) {
        p = getEvent(eventId);
      } else {
        validateSession(session);

        p = getEvent(eventId, true, session);
      }

      p.then(async (e: Event) => {
        const comp = e.competitions.filter((c) => c.id === compId)[0];
        const c: Competition = {
          id: comp.id,
          eventId: eventId,
          name: comp.name,
          type: comp.type,
          gender: comp.gender,
          description: comp.description,
          rules: comp.rules,
        };
        setComp(c);

        const participants = await getCompetitionParticipants(compId);
        const competitionParticipants = participants.map((participant) => {
          const participantRegistrationPair = e.eventRegistrations.filter((registration) => {
            if (registration.user.username === participant.username) {
              return registration.user.imageUrl;
            }
          });

          const user: User = {
            username: participant.username,
            type: participantRegistrationPair[0]?.user?.type,
            imageUrl: participantRegistrationPair[0]?.user?.imageUrl,
          };

          return user;
        });

        setCompetitionParticipants(competitionParticipants);
      });
    }
  }, []);

  useEffect(() => {
    if (compId) {
      // @ts-ignore: next-line
      getRounds(compId).then((rounds) => {
        if (rounds.length === 0) {
        } else {
          setRounds(rounds);
        }
      });
    }
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const usersMap = new Map();
      const requests: Promise<void>[] = [];
      rounds.map((round) => {
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

      await Promise.all(requests);
      setUsersMap(usersMap);
    };

    getUsers();
  }, [rounds]);

  const getAmountDirectComparisonsOfMatch = (matchSlots: MatchSlot[]) => {
    let amountComparisons = 0;
    let i = matchSlots.length;

    while (i > 0) {
      amountComparisons = amountComparisons + i - 1;

      i--;
    }

    return amountComparisons;
  };

  const mapRoundsToCsv = (rounds: Round[]): { [k: string]: AcceptedData; [k: number]: AcceptedData }[] => {
    const na = 'n/a';
    const data: { [k: string]: AcceptedData; [k: number]: AcceptedData }[] = [];

    let checkValueAmountMatches = 0;

    let matchId = 0;

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const matches = round.matchesAscending;
      for (let j = 0; j < matches.length; j++) {
        const match = matches[j];
        checkValueAmountMatches += getAmountDirectComparisonsOfMatch(match.matchSlots);

        // Loop through slots.
        // Take a slot (s1) of match.
        let k = 0;
        while (k < match.matchSlots.length - 1) {
          // Take slot (s2) of match. This is the slot after slot s1.
          let l = k + 1;
          while (l < match.matchSlots.length) {
            const s1 = match.matchSlots[k];
            const p1 = usersMap.get(s1.name);

            const s2 = match.matchSlots[l];
            const p2 = usersMap.get(s2.name);

            data.push({
              'Match ID': matchId,
              Player1: p1?.lastName ? `${p1?.firstName} ${p1?.lastName}` : p1?.firstName,
              'Player1 WFFA ID': p1?.wffaId ? p1.wffaId : na,
              'Player1 Result': s1.result !== undefined && s1.result > -1 ? s1.result : na,
              Player2: p2?.lastName ? `${p2?.firstName} ${p2?.lastName}` : p2?.firstName,
              'Player2 WFFA ID': p2?.wffaId ? p2.wffaId : na,
              'Player2 Result': s2.result !== undefined && s2.result > -1 ? s2.result : na,
            });

            matchId += 1;
            l++;
          }

          k++;
        }
      }
    }

    console.log('amount matches (check value): ', checkValueAmountMatches);
    console.log(data);

    if (data.length === checkValueAmountMatches) {
      toast.info('Processed battle results.');
    } else {
      toast.error('Export of battle results is inconsistent.');
    }
    return data;
  };

  const handleDownloadResultsClicked = () => {
    const options: ConfigOptions = { filename: `${moment().format('YYYYMMDD HHmmss')} - ${comp?.name} - results`, useKeysAsHeaders: true };
    const csvConfig = mkConfig(options);
    const csvOutput = generateCsv(csvConfig)(mapRoundsToCsv(rounds));
    download(csvConfig)(csvOutput);
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        {/* @ts-ignore TODO: remove, comp name should never be empty */}
        <PageTitle title={comp?.name} />

        <div className="mx-2 overflow-hidden">
          <Tabs defaultValue={tab || `schedule`} className="flex flex-col h-full">
            <TabsList className="mb-2">
              {rounds.length > 0 && (
                <TabsTrigger
                  value="schedule"
                  onClick={() => {
                    switchTab(router, 'schedule');
                  }}
                >
                  {`Schedule`}
                </TabsTrigger>
              )}
              {rounds.length > 1 && (
                <TabsTrigger
                  value="grid"
                  onClick={() => {
                    switchTab(router, 'grid');
                  }}
                >
                  {`Battle Grid`}
                </TabsTrigger>
              )}
              {competitionParticipants.length > 0 && (
                <TabsTrigger
                  value="participants"
                  onClick={() => {
                    switchTab(router, 'participants');
                  }}
                >
                  {`Participants`}
                </TabsTrigger>
              )}
              {(comp?.description || comp?.rules) && (
                <TabsTrigger
                  value="rules"
                  onClick={() => {
                    switchTab(router, 'rules');
                  }}
                >
                  {`Rules`}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Schedule */}
            {rounds.length > 0 && (
              <TabsContent value="schedule" className="overflow-hidden overflow-y-auto">
                {usersMap.get(session?.user?.username) && rounds.length > 1 && (
                  <div className="flex justify-center gap-2 p-2">
                    {'My battles only'}

                    <Switch
                      defaultChecked={filteredByUser !== null}
                      onCheckedChange={(checked) => {
                        checked ? setFilteredByUser(session?.user?.username) : setFilteredByUser(null);
                      }}
                    />
                  </div>
                )}

                <BattleList rounds={rounds} usersMap={usersMap} filteredByUser={filteredByUser} />
              </TabsContent>
            )}

            {/* Battle Grid */}
            {rounds.length > 1 && (
              <TabsContent value="grid" className="overflow-hidden overflow-y-auto">
                <div className="overflow-x-auto">
                  <BattleGrid rounds={rounds} usersMap={usersMap} />
                </div>
              </TabsContent>
            )}

            {/* Participants */}
            {competitionParticipants.length > 0 && (
              <TabsContent value="participants" className="overflow-hidden overflow-y-auto">
                <ParticipantList participants={competitionParticipants} />
              </TabsContent>
            )}

            {/* Rules */}
            {(comp?.description || comp?.rules) && (
              <TabsContent value="rules" className="overflow-hidden overflow-y-auto">
                <div className={'h-fit rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
                  {comp.description && (
                    <div>
                      <div className="text-base font-bold">Description</div>
                      <TextareaAutosize readOnly className="w-full p-2 resize-none bg-transparent outline-none" value={comp.description} />
                    </div>
                  )}

                  {comp.description && comp.rules && <Separator />}

                  {comp.rules && (
                    <div className={`${comp.description ? 'mt-2' : ''}`}>
                      <div className="text-base font-bold">Rules</div>
                      <TextareaAutosize readOnly className="w-full p-2 resize-none bg-transparent outline-none" value={comp.rules} />
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <Navigation>
          <ActionButton
            action={Action.BACK}
            onClick={() => {
              let path = `${routeEvents}/${eventId}`;
              if (needsAuthorization) {
                path = `${path}?auth=1`;
              }

              router.push(path);
            }}
          />

          <TextButton text="Download Data" onClick={handleDownloadResultsClicked} />
        </Navigation>
      </div>
    </>
  );
};

export default CompetitionDetails;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
