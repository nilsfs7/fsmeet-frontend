/*
  - runden erst erstellen lassen nachdem registrierung zuende
  - dadurch ist die teilnehmeranzahl bekannt
*/

import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import Navigation from '@/components/Navigation';
import BattleGrid from '@/components/comp/BattleGrid';
import Link from 'next/link';
import { Moment } from 'moment';
import { validateSession } from '@/types/funcs/validate-session';
import { deleteRounds } from '@/services/fsmeet-backend/delete-round';
import { getCompetitionParticipants } from '@/services/fsmeet-backend/get-competition-participants';
import { createRounds } from '@/services/fsmeet-backend/create-rounds';
import { Round } from '@/types/round';
import DialogAddRound from '@/components/comp/editor/DialogAddRound';
import TextButton from '@/components/common/TextButton';
import DialogAddMatch from '@/components/comp/editor/DialogAddMatch';
import DialogEditRound from '@/components/comp/editor/DialogEditRound';
import DialogEditMatch from '@/components/comp/editor/DialogEditMatch';
import DialogDeleteMatch from '@/components/comp/editor/DialogDeleteMatch';
import DialogDeleteRound from '@/components/comp/editor/DialogDeleteRound';
import { getRounds } from '@/services/fsmeet-backend/get-rounds';
import { plainToInstance } from 'class-transformer';
import { updateRounds } from '@/services/fsmeet-backend/update-rounds';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';

const ModeEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  // const minMatchSize = 2;
  // const minPassingPerMatch = 1;
  // const minPassingExtra = 0;

  const [numParticipants] = useState<number>(props.data.participants.length);
  const [gameModeApplied, setGameModeApplied] = useState<boolean>(plainToInstance(Round, props.data.rounds).length > 0);
  const [rounds, setRounds] = useState<Round[]>(plainToInstance(Round, props.data.rounds));

  // const [roundOptionsLocked, setRoundOptionsLocked] = useState<boolean[]>([false]);

  const handleSaveClicked = async () => {
    if (compId) {
      try {
        await createRounds(compId?.toString(), rounds, session);
        toast.success(`Rounds successfully created`);
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

  // useEffect(() => {
  //   if (compId) {
  //     rounds.map((rnd, i) => {
  //       // update input "max-match-size"
  //       const inputMaxMatchSize = document.getElementById(`input-max-match-size-${i}`);
  //       if (inputMaxMatchSize) {
  //         const maxMatchSize = i === 0 ? competitionParticipants.length : getParentRound(i).advancingTotal;
  //         inputMaxMatchSize.setAttribute('max', maxMatchSize.toString());
  //       }

  //       // update input "max-passing"
  //       const inputMaxPassing = document.getElementById(`input-max-passing-${i}`);
  //       if (inputMaxPassing) {
  //         const maxPassing = rnd.maxMatchSize;
  //         inputMaxPassing.setAttribute('max', maxPassing.toString());
  //       }

  //       // update input "passing-extra"
  //       const inputPassingExtra = document.getElementById(`input-passing-extra-${i}`);
  //       if (inputPassingExtra) {
  //         inputPassingExtra.setAttribute('max', rnd.maxPossibleAdvancingExtra.toString());
  //       }
  //     });
  //   }
  // }, [rounds]);

  // const getParentRound = (roundId: number): Round => {
  //   return rounds[roundId - 1];
  // };

  const getLastRound = (): Round => {
    return rounds[rounds.length - 1];
  };

  // const changeMaxMatchSize = (roundId: number, maxMatchSize: number) => {
  //   const rnds = Array.from(rounds);

  //   const parentRound = getParentRound(roundId);
  //   const maxVal = roundId === 0 ? competitionParticipants.length : parentRound.matches.length * parentRound.passingPerMatch + parentRound.passingExtra;
  //   if (+maxMatchSize >= minMatchSize && +maxMatchSize <= maxVal) {
  //     rnds[roundId].maxMatchSize = +maxMatchSize;
  //     rnds[roundId].matches = rnds[roundId].createMatches();
  //     setRounds(rnds);
  //   }
  // };

  // const changePassingPerMatch = (roundId: number, passingPerMatch: number) => {
  //   const rnds = Array.from(rounds);

  //   if (+passingPerMatch >= minPassingPerMatch && +passingPerMatch <= rnds[roundId].maxMatchSize) {
  //     rnds[roundId].passingPerMatch = +passingPerMatch;
  //     setRounds(rnds);
  //   }
  // };

  // const changePassingExtra = (roundId: number, passingExtra: number) => {
  //   const rnds = Array.from(rounds);

  //   if (+passingExtra >= minPassingExtra && +passingExtra <= rnds[roundId].maxPossibleAdvancingExtra) {
  //     rnds[roundId].passingExtra = +passingExtra;
  //     setRounds(rnds);
  //   }
  // };

  const getAvailablePlayers = (): number => {
    const rnd = getLastRound();
    return rnd ? rnd.advancingTotal : numParticipants;
  };

  const handleAddRoundClicked = async () => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?addround=1`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleEditRoundClicked = async (roundIndex: number) => {
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?editround=1&rid=${roundIndex}&rname=${rounds[roundIndex].name}&radvancing=${rounds[roundIndex].advancingTotal}`;
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
    const url = `${routeEvents}/${eventId}/comps/${compId}/edit/mode?editmatch=1&rid=${roundIndex}&mid=${matchIndex}&mname=${rounds[roundIndex].matches[matchIndex].name}&mslots=${rounds[roundIndex].matches[matchIndex].slots}&mextra=${rounds[roundIndex].matches[matchIndex].isExtraMatch}`;
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

  const handleConfirmAddRoundClicked = async (slotsPerMatch: number, advancingTotal: number, roundName: string) => {
    const rnds = Array.from(rounds);

    // const newRound = new Round(rnds.length, roundName, getAvailablePlayers(), advancingTotal);
    const newRound = new Round(rnds.length, roundName, advancingTotal);

    // for (let i = 0; i < Math.ceil(getAvailablePlayers() / slotsPerMatch); i++) {
    for (let i = 0; i < Math.ceil(getAvailablePlayers() / slotsPerMatch); i++) {
      newRound.addMatch(`Match ${i + 1}`, false, slotsPerMatch);
    }

    rnds.push(newRound);
    setRounds(rnds);
  };

  const handleConfirmEditRoundClicked = async (roundIndex: number, roundName: string, advancingTotal: number) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].name = roundName;
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

  const handleConfirmAddMatchClicked = async (roundIndex: number, matchIndex: number, matchName: string, amountSlots: number, isExtraMatch: boolean) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].addMatch(matchName, isExtraMatch, amountSlots);
    setRounds(rnds);
  };

  const handleConfirmEditMatchClicked = async (roundIndex: number, matchIndex: number, matchName: string, slots: number, isExtraMatch: boolean) => {
    const rnds = Array.from(rounds);
    const mtchs = Array.from(rnds[roundIndex].matches);
    mtchs[matchIndex].name = matchName;
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
        onConfirm={(slotsPerMatch: number, advancingTotal: number, roundName: string) => {
          handleConfirmAddRoundClicked(slotsPerMatch, advancingTotal, roundName);
        }}
        confirmText="Confirm"
        roundIndex={rounds.length}
        availablePlayers={getAvailablePlayers()}
      />

      <DialogEditRound
        title="Edit Round"
        queryParam="editround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, roundName: string, advancingTotal: number) => {
          handleConfirmEditRoundClicked(roundIndex, roundName, advancingTotal);
        }}
        confirmText="Confirm"
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
        onConfirm={(roundIndex: number, matchIndex: number, matchName: string, amountSlots: number, isExtraMatch: boolean) => {
          handleConfirmAddMatchClicked(roundIndex, matchIndex, matchName, amountSlots, isExtraMatch);
        }}
        confirmText="Confirm"
      />

      <DialogEditMatch
        title="Edit Match"
        queryParam="editmatch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number, matchName: string, slots: number, isExtraMatch: boolean) => {
          handleConfirmEditMatchClicked(roundIndex, matchIndex, matchName, slots, isExtraMatch);
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

      <div className="absolute inset-0 flex flex-col">
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
              // onUpdateTime={(roundIndex, matchIndex, matchId, time) => {
              //   handleTimeUpdated(roundIndex, matchIndex, matchId, time);
              // }}
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
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  const compId = context.query.compId;

  let data: { rounds: Round[]; participants: { username: string }[] } = { rounds: [], participants: [] };

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
