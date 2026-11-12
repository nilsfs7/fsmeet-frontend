'use client';

import { useSession } from 'next-auth/react';
import { Event } from '@/domain/types/event';
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
import { createRound, roundAddMatch, type Round } from '@/domain/types/round';
import { createRounds, deleteRounds, getCompetitionParticipants, updateRounds } from '@/infrastructure/clients/competition.client';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import Navigation from '@/components/navigation';
import BattleGrid from '@/components/comp/battle-grid';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeEvents } from '@/domain/constants/routes';
import { User } from '@/domain/types/user';
import Link from 'next/link';
import { IconPlus, IconTournament, IconUsers } from '@tabler/icons-react';
import { EmptyState } from '@/components/common/empty-state';
import { CompWorkflowSteps } from '@/components/comp/comp-workflow-steps';
import { cn } from '@/lib/utils';

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
  const [gameModeApplied, setGameModeApplied] = useState<boolean>();
  const [rounds, setRounds] = useState<Round[]>(() => structuredClone(roundsInit));
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());
  const [refreshKey, setRefreshKey] = useState(0);

  const totalMatches = rounds.reduce((sum, round) => sum + round.matches.length, 0);
  const finalSet = rounds.length > 0 && rounds[rounds.length - 1].advancingTotal <= 1;

  const handleSaveClicked = async () => {
    if (compId) {
      try {
        await createRounds(compId?.toString(), rounds, session);
        toast.success(t('toastRoundsCreated'));
        setRefreshKey(k => k + 1);
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
        toast.success(t('toastRoundsUpdated'));
        setRefreshKey(k => k + 1);
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
        toast.success(t('toastRoundDeleted'));
        setRefreshKey(k => k + 1);
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

  function setRoundDateToMatchTime(roundDate: string | null, matchTime: string | null) {
    if (roundDate && matchTime) {
      const r = moment(roundDate).utc();
      // Support "HH:mm" from TimePicker; otherwise parse as full datetime (e.g. ISO from server)
      const timePart = /^\d{1,2}:\d{2}$/.test(matchTime.trim()) ? matchTime.trim() : moment(matchTime).utc().format('HH:mm');
      const format = `${r.format('YYYY-MM-DD')}T${timePart}:00.000Z`;
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

    const newRound = createRound(rnds.length, roundName, roundDate, roundTimeLimit, advancingTotal, []);

    for (let i = 0; i < Math.ceil(getAvailablePlayers() / slotsPerMatch); i++) {
      roundAddMatch(newRound, t('defaultMatchName', { index: i + 1 }), null, false, slotsPerMatch);
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
    rnds.map(rnd => {
      if (rnd.roundIndex > roundIndex) {
        rnd.roundIndex -= 1;
      }
    });
    setRounds(rnds);
  };

  const handleConfirmAddMatchClicked = async (roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, amountSlots: number, isExtraMatch: boolean) => {
    const rnds = Array.from(rounds);
    matchTime = setRoundDateToMatchTime(rnds[roundIndex].date, matchTime);
    roundAddMatch(rnds[roundIndex], matchName, matchTime, isExtraMatch, amountSlots);
    setRounds(rnds);
  };

  const handleConfirmEditMatchClicked = async (roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, slots: number, isExtraMatch: boolean) => {
    const rnds = Array.from(rounds);
    const mtchs = Array.from(rnds[roundIndex].matches);
    matchTime = setRoundDateToMatchTime(rnds[roundIndex].date, matchTime);

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
    rnds[roundIndex].matches.map(mtch => {
      if (mtch.matchIndex > matchIndex) {
        mtch.matchIndex -= 1;
      }
    });
    setRounds(rnds);
  };

  useEffect(() => {
    setGameModeApplied(roundsInit.length > 0);
  }, [rounds]);

  useEffect(() => {
    getCompetitionParticipants(compId).then(participants => {
      const usersMap = new Map();
      participants.map(participant => {
        usersMap.set(participant.username, participant);
      });

      setUsersMap(usersMap);
    });
  }, []);

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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-content flex-col gap-4">
          <CompWorkflowSteps eventId={event.id ?? ''} compId={compId} current="mode" refreshKey={refreshKey} />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground">{t('statPlayers', { count: numParticipants })}</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground">{t('statRounds', { count: rounds.length })}</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground">{t('statMatches', { count: totalMatches })}</span>
                {!gameModeApplied && rounds.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">{t('chipNotSaved')}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{finalSet ? t('noteFinalSet') : t('hintMode')}</p>
            </div>

            {numParticipants > 1 && (rounds.length === 0 || getLastRound().advancingTotal > 1) && (
              <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'shrink-0')} onClick={handleAddRoundClicked}>
                <IconPlus className="h-4 w-4" stroke={2} aria-hidden />
                {t('btnAddRound')}
              </Button>
            )}
          </div>

          {numParticipants < 2 && (
            <EmptyState
              icon={<IconUsers stroke={1.75} aria-hidden />}
              title={t('textNoSufficientPool')}
              action={
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href={`${routeEvents}/${event.id}/comps/${compId}/edit/pool`}>{t('btnGoToPool')}</Link>
                </Button>
              }
            />
          )}

          {numParticipants > 1 && rounds.length === 0 && <EmptyState icon={<IconTournament stroke={1.75} aria-hidden />} title={t('textNoRounds')} />}

          {rounds.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-3 sm:p-4">
              <BattleGrid
                rounds={rounds}
                usersMap={usersMap}
                editingEnabled={true}
                showUserCountryFlag={event.showUserCountryFlag}
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
          )}
        </div>
      </div>

      {/* TODO: move navigation to page.tsx */}
      <Navigation>
        <ActionButton href={`${routeEvents}/${event.id}/comps`} action={Action.BACK} />

        {!gameModeApplied && rounds.length > 0 && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSaveClicked}>
            {t('btnSave')}
          </Button>
        )}
        {gameModeApplied && rounds.length > 0 && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleUpdateClicked}>
            {t(`btnUpdate`)}
          </Button>
        )}
        {gameModeApplied && rounds.length === 0 && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleDeleteClicked}>
            {t('btnDelete')}
          </Button>
        )}
      </Navigation>
    </>
  );
};
