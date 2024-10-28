'use client';

import { useSession } from 'next-auth/react';
import { Event } from '@/types/event';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import DialogAddRound from '@/app/events/[eventId]/comps/[compId]/edit/mode/components/dialog-add-round';
import DialogAddMatch from '@/app/events/[eventId]/comps/[compId]/edit/mode/components/dialog-add-match';
import DialogEditRound from '@/app/events/[eventId]/comps/[compId]/edit/mode/components/dialog-edit-round';
import DialogEditMatch from '@/app/events/[eventId]/comps/[compId]/edit/mode/components/dialog-edit-match';
import DialogDeleteMatch from '@/app/events/[eventId]/comps/[compId]/edit/mode/components/dialog-delete-match';
import DialogDeleteRound from '@/app/events/[eventId]/comps/[compId]/edit/mode/components/dialog-delete-round';
import moment, { Moment } from 'moment';
import { Round } from '@/domain/classes/round';
import { createRounds, deleteRounds, updateRounds } from '@/infrastructure/clients/competition.client';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import Navigation from '@/components/Navigation';
import BattleGrid from '@/components/comp/BattleGrid';
import TextButton from '@/components/common/TextButton';
import { routeEvents } from '@/domain/constants/routes';
import Link from 'next/link';
import { plainToInstance } from 'class-transformer';

interface IRoundEditor {
  event: Event;
  compId: string;
  roundsInit: Round[];
  participants: {
    username: string;
  }[];
}

export const GameModeEditor = ({ event, compId, roundsInit, participants }: IRoundEditor) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const { data: session } = useSession();

  const router = useRouter();

  const [numParticipants] = useState<number>(participants.length);
  const [gameModeApplied, setGameModeApplied] = useState<boolean>(); // plainToInstance(Round, props.data.rounds).length > 0
  const [rounds, setRounds] = useState<Round[]>(plainToInstance(Round, roundsInit));

  const handleSaveClicked = async () => {
    if (compId) {
      try {
        await createRounds(compId?.toString(), rounds, session);
        toast.success(`Rounds successfully created`);
        router.refresh(); // TODO: remove, must reload to switch from save to update method.
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
        router.refresh();
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
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode?addround=1`;
    router.replace(url);
  };

  const handleEditRoundClicked = async (roundIndex: number) => {
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode?editround=1&rid=${roundIndex}&rname=${rounds[roundIndex].name}&rdate=${rounds[roundIndex].date}&rtimelimit=${rounds[roundIndex].timeLimit}&radvancing=${rounds[roundIndex].advancingTotal}`;
    router.replace(url);
  };

  const handleDeleteRoundClicked = async (roundIndex: number) => {
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode?deleteround=1&rid=${roundIndex}&rname=${rounds[roundIndex].name}`;
    router.replace(url);
  };

  const handleAddMatchClicked = async (roundIndex: number) => {
    const newMatchIndex = rounds[roundIndex].matches.length;
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode?addmatch=1&rid=${roundIndex}&mid=${newMatchIndex}`;
    router.replace(url);
  };

  const handleEditMatchClicked = async (roundIndex: number, matchIndex: number) => {
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode?editmatch=1&rid=${roundIndex}&mid=${matchIndex}&mname=${rounds[roundIndex].matches[matchIndex].name}&mtime=${rounds[roundIndex].matches[matchIndex].time}&mslots=${rounds[roundIndex].matches[matchIndex].slots}&mextra=${rounds[roundIndex].matches[matchIndex].isExtraMatch}`;
    router.replace(url);
  };

  const handleDeleteMatchClicked = async (roundIndex: number, matchIndex: number) => {
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode?deletematch=1&rid=${roundIndex}&mid=${matchIndex}&mname=${rounds[roundIndex].matches[matchIndex].name}`;
    router.replace(url);
  };

  const handleCancelDialogClicked = async () => {
    const url = `${routeEvents}/${event.id}/comps/${compId}/edit/mode`;
    router.replace(url);
  };

  const handleConfirmAddRoundClicked = async (slotsPerMatch: number, advancingTotal: number, roundName: string, roundDate: string, roundTimeLimit: boolean) => {
    const rnds = Array.from(rounds);

    const newRound = new Round(rnds.length, roundName, roundDate, roundTimeLimit, advancingTotal);

    for (let i = 0; i < Math.ceil(getAvailablePlayers() / slotsPerMatch); i++) {
      newRound.addMatch(`Match ${i + 1}`, null, false, slotsPerMatch);
    }

    rnds.push(newRound);
    setRounds(rnds);
  };

  const handleConfirmEditRoundClicked = async (roundIndex: number, roundName: string, roundDate: string, roundTimeLimit: boolean, advancingTotal: number) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].name = roundName;
    rnds[roundIndex].date = roundDate;
    rnds[roundIndex].timeLimit = roundTimeLimit;
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

  useEffect(() => {
    setGameModeApplied(rounds.length > 0);
  }, [rounds]);

  return (
    <>
      <Toaster richColors />

      <DialogAddRound
        title={t('dlgAddRoundTitle')}
        queryParam="addround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(slotsPerMatch: number, advancingTotal: number, roundName: string, roundDate: string, roundTimeLimit: boolean) => {
          handleConfirmAddRoundClicked(slotsPerMatch, advancingTotal, roundName, roundDate, roundTimeLimit);
        }}
        confirmText={t('dlgAddRoundBtnConfirm')}
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
        title={t('dlgEditRoundTitle')}
        queryParam="editround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, roundName: string, roundDate: string, roundTimeLimit: boolean, advancingTotal: number) => {
          handleConfirmEditRoundClicked(roundIndex, roundName, roundDate, roundTimeLimit, advancingTotal);
        }}
        confirmText={t('dlgEditRoundBtnConfirm')}
        dateFrom={event.dateFrom}
        dateTo={event.dateTo}
      />

      <DialogDeleteRound
        title={t('dlgDeleteRoundTitle')}
        queryParam="deleteround"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number) => {
          handleConfirmDeleteRoundClicked(roundIndex);
        }}
        confirmText={t('dlgDeleteRoundBtnConfirm')}
      />

      <DialogAddMatch
        title={t('dlgAddMatchTitle')}
        queryParam="addmatch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, amountSlots: number, isExtraMatch: boolean) => {
          handleConfirmAddMatchClicked(roundIndex, matchIndex, matchName, matchTime, amountSlots, isExtraMatch);
        }}
        confirmText={t('dlgAddMatchBtnConfirm')}
      />

      <DialogEditMatch
        title={t('dlgEditMatchTitle')}
        queryParam="editmatch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, slots: number, isExtraMatch: boolean) => {
          handleConfirmEditMatchClicked(roundIndex, matchIndex, matchName, matchTime, slots, isExtraMatch);
        }}
        confirmText={t('dlgEditMatchBtnConfirm')}
      />

      <DialogDeleteMatch
        title={t('dlgDeleteMatchTitle')}
        queryParam="deletematch"
        onCancel={handleCancelDialogClicked}
        onConfirm={(roundIndex: number, matchIndex: number) => {
          handleConfirmDeleteMatchClicked(roundIndex, matchIndex);
        }}
        confirmText={t('dlgDeleteMatchBtnConfirm')}
      />

      <div className={`mx-2 flex flex-col overflow-hidden`}>
        {numParticipants > 1 && (
          <div className={'mt-2 flex flex-col items-center'}>{(rounds.length === 0 || getLastRound().advancingTotal > 1) && <TextButton text={`Add Round`} onClick={handleAddRoundClicked} />}</div>
        )}

        <div className={'mt-2 flex justify-center overflow-y-auto'}>
          {numParticipants < 2 && <div>{t('textNoSufficientPool')}</div>}

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

      {/* TODO: move navigation to page.tsx */}
      <Navigation>
        <Link href={`${routeEvents}/${event.id}/comps`}>
          <ActionButton action={Action.BACK} />
        </Link>

        {!gameModeApplied && rounds.length > 0 && <TextButton text={t('btnSave')} onClick={handleSaveClicked} />}
        {gameModeApplied && rounds.length > 0 && <TextButton text={t(`btnUpdate`)} onClick={handleUpdateClicked} />}
        {gameModeApplied && rounds.length === 0 && <TextButton text={t('btnDelete')} onClick={handleDeleteClicked} />}
      </Navigation>
    </>
  );
};
