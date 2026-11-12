'use client';

import { useEffect, useState, use } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import Navigation from '@/components/navigation';
import type { Round } from '@/domain/types/round';
import BattleGrid from '@/components/comp/battle-grid';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/page-title';
import { User } from '@/domain/types/user';
import { getCompetition, getCompetitionParticipants, getRounds, updateMatchSlots } from '@/infrastructure/clients/competition.client';
import { Competition } from '@/domain/types/competition';
import Link from 'next/link';
import { IconInfoCircle, IconTournament } from '@tabler/icons-react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { CompWorkflowSteps } from '@/components/comp/comp-workflow-steps';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';

export default function Seeding(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/comps/compid/edit/seeding');
  const { data: session } = useSession();

  const [event, setEvent] = useState<Event>();
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [comp, setComp] = useState<Competition>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSlotUpdated = async (roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => {
    const rnds = Array.from(rounds);
    const match = rnds[roundIndex].matches.filter(match => {
      if (match.id === matchId) {
        return match;
      }
    })[0];

    let slotIndexFound = false;
    for (let i = 0; i < match.matchSlots.length; i++) {
      if (match.matchSlots[i].slotIndex === slotIndex) {
        match.matchSlots[i].name = username;
        match.matchSlots[i].result = result;

        slotIndexFound = true;
      }
    }

    if (!slotIndexFound) {
      match.matchSlots.push({
        id: '',
        slotIndex: slotIndex,
        name: username,
        result: result,
      });
    }

    setRounds(rnds);

    try {
      await updateMatchSlots(params.eventId, params.compId, matchId, slotIndex, username, result, session);
      toast.success(t('toastSlotUpdated'));
      setRefreshKey(k => k + 1);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getEvent(params.eventId).then(event => {
      setEvent(event);
    });

    getCompetitionParticipants(params.compId).then(participants => {
      const usersMap = new Map();
      participants.map(participant => {
        usersMap.set(participant.username, participant);
      });

      setUsersMap(usersMap);
    });

    getRounds(params.compId).then(rounds => {
      setRounds(rounds);
      setLoaded(true);
    });

    getCompetition(params.compId).then(comp => {
      setComp(comp);
    });
  }, []);

  return (
    <>
      <Toaster richColors />

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} description={comp?.name} />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-content flex-col gap-4">
            <CompWorkflowSteps eventId={params.eventId} compId={params.compId} current="seeding" refreshKey={refreshKey} />

            {loaded && rounds.length === 0 && (
              <EmptyState
                icon={<IconTournament stroke={1.75} aria-hidden />}
                title={t('textNoGameMode')}
                action={
                  <Button asChild variant="action" className={ctaActionButtonClassName}>
                    <Link href={`${routeEvents}/${params.eventId}/comps/${params.compId}/edit/mode`}>{t('btnGoToGameMode')}</Link>
                  </Button>
                }
              />
            )}

            {rounds.length > 0 && (
              <>
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground shadow-xs">
                  <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" stroke={2} aria-hidden />
                  <p>{t('hintSeeding')}</p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-3 sm:p-4">
                  <BattleGrid
                    rounds={rounds}
                    usersMap={usersMap}
                    seedingEnabled={true}
                    showUserCountryFlag={event?.showUserCountryFlag}
                    onUpdateSlot={(roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => {
                      handleSlotUpdated(roundIndex, matchId, slotIndex, username, result);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <Navigation>
          <ActionButton href={`${routeEvents}/${params.eventId}/comps`} action={Action.BACK} />
        </Navigation>
      </div>
    </>
  );
}
