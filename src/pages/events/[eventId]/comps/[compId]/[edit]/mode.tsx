/*
  - runden erst erstellen lassen nachdem registrierung zuende
  - dadurch ist die teilnehmeranzahl bekannt
*/

import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import Navigation from '@/components/Navigation';
import BattleGrid from '@/components/comp/BattleGrid';
import Link from 'next/link';
import { validateSession } from '@/types/funcs/validate-session';
import { Round } from '@/types/round';
import DialogAddRound from '@/components/comp/editor/DialogAddRound';
import TextButton from '@/components/common/TextButton';
import DialogAddMatch from '@/components/comp/editor/DialogAddMatch';
import DialogEditRound from '@/components/comp/editor/DialogEditRound';
import DialogEditMatch from '@/components/comp/editor/DialogEditMatch';
import DialogDeleteMatch from '@/components/comp/editor/DialogDeleteMatch';
import DialogDeleteRound from '@/components/comp/editor/DialogDeleteRound';
import { plainToInstance } from 'class-transformer';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import moment, { Moment } from 'moment';
import { Event } from '@/types/event';
import { getEvent } from '@/infrastructure/clients/event.client';
import { createRounds, deleteRounds, getCompetitionParticipants, getRounds, updateRounds } from '@/infrastructure/clients/competition.client';

const ModeEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [numParticipants] = useState<number>(props.data.participants.length);
  const [gameModeApplied] = useState<boolean>(plainToInstance(Round, props.data.rounds).length > 0);
  const [rounds, setRounds] = useState<Round[]>(plainToInstance(Round, props.data.rounds));
  const [event] = useState<Event>(props.data.event);

  const handleSaveClicked = async () => {
    if (compId) {
      try {
        await createRounds(compId?.toString(), rounds, session);
        toast.success(`Rounds successfully created`);
        router.reload(); // TODO: remove, must reload to swutsch from save to update method.
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleUpdateClicked = async () => {
    if (compId) {
      try {
        await updateRounds(compId?.toString(), rounds, session);
        toast.success(`Rounds successfully updated`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleDeleteClicked = async () => {
    if (compId) {
      try {
        await deleteRounds(compId?.toString(), session);
        toast.success(`Round successfully deleted`);
        router.reload();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const getLastRound = (): Round => {
    return rounds[rounds.length - 1];
  };

  function getDiffInNumOfDays(date1: Moment, date2: Moment): number {
    let diff = date1.diff(date2, 'days');

    if (diff < 0) {
      diff *= -1;
    }

    return diff;
  }

  function getRoundDateForMatchTime(roundDate: string | null, matchTime: string | null) {
    if (roundDate && matchTime) {
      const r = moment(roundDate).utc();
      const m = moment(matchTime).utc();
      const format = `${r.format('YYYY-MM-DD')}T${m.format('HH:mm')}:00.000Z`;

      return moment(format).utc().format();
    }

    return null;
  }

  const getAvailablePlayers = (): number => {
    const rnd = getLastRound();
    return rnd ? rnd.advancingTotal : numParticipants;
  };

  const handleAddRoundClicked = async () => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?addround=1`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleEditRoundClicked = async (roundIndex: number) => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?editround=1&rid=${roundIndex}&rname=${rounds[roundIndex].name}&rdate=${rounds[roundIndex].date}&radvancing=${rounds[roundIndex].advancingTotal}`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleDeleteRoundClicked = async (roundIndex: number) => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?deleteround=1&rid=${roundIndex}&rname=${rounds[roundIndex].name}`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleAddMatchClicked = async (roundIndex: number) => {
    const newMatchIndex = rounds[roundIndex].matches.length;
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?addmatch=1&rid=${roundIndex}&mid=${newMatchIndex}`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleEditMatchClicked = async (roundIndex: number, matchIndex: number) => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?editmatch=1&rid=${roundIndex}&mid=${matchIndex}&mname=${rounds[roundIndex].matches[matchIndex].name}&mtime=${rounds[roundIndex].matches[matchIndex].time}&mslots=${rounds[roundIndex].matches[matchIndex].slots}&mextra=${rounds[roundIndex].matches[matchIndex].isExtraMatch}`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleDeleteMatchClicked = async (roundIndex: number, matchIndex: number) => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?deletematch=1&rid=${roundIndex}&mid=${matchIndex}&mname=${rounds[roundIndex].matches[matchIndex].name}`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleCancelDialogClicked = async () => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleConfirmAddRoundClicked = async (slotsPerMatch: number, advancingTotal: number, roundName: string, roundDate: string) => {
    const rnds = Array.from(rounds);

    const newRound = new Round(rnds.length, roundName, roundDate, advancingTotal);

    for (let i = 0; i < Math.ceil(getAvailablePlayers() / slotsPerMatch); i++) {
      newRound.addMatch(`Match ${i + 1}`, null, false, slotsPerMatch);
    }

    rnds.push(newRound);
    setRounds(rnds);
  };

  const handleConfirmEditRoundClicked = async (roundIndex: number, roundName: string, roundDate: string, advancingTotal: number) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].name = roundName;
    rnds[roundIndex].date = roundDate;
    rnds[roundIndex].advancingTotal = advancingTotal;
    setRounds(rnds);
  };

  const handleConfirmDeleteRoundClicked = async (roundIndex: number) => {
    const rnds = Array.from(rounds);
    rnds.splice(roundIndex, 1);
    rnds.map((rnd) => {
      if (rnd.roundIndex > roundIndex) {
        rnd.roundIndex -= 1;
      }
    });
    setRounds(rnds);
  };

  const handleConfirmAddMatchClicked = async (roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, amountSlots: number, isExtraMatch: boolean) => {
    const rnds = Array.from(rounds);
    matchTime = getRoundDateForMatchTime(rnds[roundIndex].date, matchTime);
    rnds[roundIndex].addMatch(matchName, matchTime, isExtraMatch, amountSlots);
    setRounds(rnds);
  };

  const handleConfirmEditMatchClicked = async (roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, slots: number, isExtraMatch: boolean) => {
    const rnds = Array.from(rounds);
    const mtchs = Array.from(rnds[roundIndex].matches);
    matchTime = getRoundDateForMatchTime(rnds[roundIndex].date, matchTime);

    mtchs[matchIndex].name = matchName;
    mtchs[matchIndex].time = matchTime;
    mtchs[matchIndex].slots = slots;
    mtchs[matchIndex].isExtraMatch = isExtraMatch;

    if (mtchs[matchIndex].matchSlots.length > slots) {
      mtchs[matchIndex].matchSlots = mtchs[matchIndex].matchSlots.slice(0, slots);
    }
    rnds[roundIndex].matches = mtchs;

    setRounds(rnds);
  };

  const handleConfirmDeleteMatchClicked = async (roundIndex: number, matchIndex: number) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].matches.splice(matchIndex, 1);
    rnds[roundIndex].matches.map((mtch) => {
      if (mtch.matchIndex > matchIndex) {
        mtch.matchIndex -= 1;
      }
    });
    setRounds(rnds);
  };

  return (
    <>
      <Toaster richColors />

      <DialogAddRound
        title="Add Round"
        queryParam="addround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(slotsPerMatch: number, advancingTotal: number, roundName: string, roundDate: string) => {
          handleConfirmAddRoundClicked(slotsPerMatch, advancingTotal, roundName, roundDate);
        }}
        confirmText="Confirm"
        roundIndex={rounds.length}
        availablePlayers={getAvailablePlayers()}
        dateFrom={
          getLastRound()?.date
            ? moment(event.dateFrom)
                .add(getDiffInNumOfDays(moment(event.dateFrom), moment(getLastRound().date)), 'days')
                .format()
            : event.dateFrom
        }
        dateTo={event.dateTo}
      />

      <DialogEditRound
        title="Edit Round"
        queryParam="editround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, roundName: string, roundDate: string, advancingTotal: number) => {
          handleConfirmEditRoundClicked(roundIndex, roundName, roundDate, advancingTotal);
        }}
        confirmText="Confirm"
        dateFrom={event.dateFrom}
        dateTo={event.dateTo}
      />

      <DialogDeleteRound
        title="Delete Round"
        queryParam="deleteround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number) => {
          handleConfirmDeleteRoundClicked(roundIndex);
        }}
        confirmText="Confirm"
      />

      <DialogAddMatch
        title="Add Match"
        queryParam="addmatch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, amountSlots: number, isExtraMatch: boolean) => {
          handleConfirmAddMatchClicked(roundIndex, matchIndex, matchName, matchTime, amountSlots, isExtraMatch);
        }}
        confirmText="Confirm"
      />

      <DialogEditMatch
        title="Edit Match"
        queryParam="editmatch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, slots: number, isExtraMatch: boolean) => {
          handleConfirmEditMatchClicked(roundIndex, matchIndex, matchName, matchTime, slots, isExtraMatch);
        }}
        confirmText="Confirm"
      />

      <DialogDeleteMatch
        title="Delete Match"
        queryParam="deletematch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number) => {
          handleConfirmDeleteMatchClicked(roundIndex, matchIndex);
        }}
        confirmText="Confirm"
      />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Game Mode Editor" />

        <div className={`mx-2 flex flex-col overflow-hidden`}>
          {numParticipants > 1 && (
            <div className={'mt-2 flex flex-col items-center'}>{(rounds.length === 0 || getLastRound().advancingTotal > 1) && <TextButton text={`Add Round`} onClick={handleAddRoundClicked} />}</div>
          )}

          <div className={'mt-2 flex justify-center overflow-y-auto'}>
            {numParticipants < 2 && <div>{`Add at least 2 players to the competition pool before creating a game mode.`}</div>}

            <BattleGrid
              rounds={rounds}
              editingEnabled={true}
              onEditRound={(roundIndex: number) => {
                handleEditRoundClicked(roundIndex);
              }}
              onDeleteRound={(roundIndex: number) => {
                handleDeleteRoundClicked(roundIndex);
              }}
              onAddMatch={(roundIndex: number) => {
                handleAddMatchClicked(roundIndex);
              }}
              onEditMatch={(roundIndex: number, matchIndex: number) => {
                handleEditMatchClicked(roundIndex, matchIndex);
              }}
              onDeleteMatch={(roundIndex: number, matchIndex: number) => {
                handleDeleteMatchClicked(roundIndex, matchIndex);
              }}
            />
          </div>
        </div>

        <Navigation>
          <Link href={`${routeEvents}/${eventId}/comps`}>
            <ActionButton action={Action.BACK} onClick={() => router.replace(`${routeEvents}/${eventId}/comps`)} />
          </Link>

          {!gameModeApplied && rounds.length > 0 && <TextButton text={`Save`} onClick={handleSaveClicked} />}
          {gameModeApplied && rounds.length > 0 && <TextButton text={`Update`} onClick={handleUpdateClicked} />}
          {gameModeApplied && rounds.length === 0 && <TextButton text={`Save`} onClick={handleDeleteClicked} />}
        </Navigation>
      </div>
    </>
  );
};

export default ModeEditing;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  const eventId = context.query.eventId;
  const compId = context.query.compId;

  let data: { event: Event | null; rounds: Round[]; participants: { username: string }[] } = { event: null, rounds: [], participants: [] };

  if (eventId) {
    try {
      data.event = JSON.parse(JSON.stringify(await getEvent(eventId?.toString())));
    } catch (error: any) {
      console.error('Error fetching event.');
    }
  }

  if (compId) {
    try {
      data.rounds = JSON.parse(JSON.stringify(await getRounds(compId?.toString())));
    } catch (error: any) {
      console.error('Error fetching rounds.');
    }

    try {
      data.participants = await getCompetitionParticipants(compId?.toString());
    } catch (error: any) {
      console.error('Error fetching participants.');
    }
  }

  return {
    props: {
      session: session,
      data: data,
    },
  };
};
