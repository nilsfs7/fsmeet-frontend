'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { routeEventNotFound, routeEvents } from '@/domain/constants/routes';
import CompetitionEditor from '@/components/events/competition-editor';
import { Competition } from '@/domain/types/competition';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Event } from '@/domain/types/event';
import Dialog from '@/components/dialog';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import PageTitle from '@/components/page-title';
import { getEvent } from '@/infrastructure/clients/event.client';
import { deleteCompetition, getCompetition, updateCompetition } from '@/infrastructure/clients/competition.client';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { CompWorkflowSteps } from '@/components/comp/comp-workflow-steps';

export default function CompetitionEditing(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/comps/edit');
  const { data: session, status } = useSession();
  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [comp, setComp] = useState<Competition>();

  const handleSaveClicked = async () => {
    if (comp) {
      try {
        await updateCompetition(comp, session);
        toast.success(t('toastUpdated'));
        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/comps`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/comps/${params.compId}/edit?delete=1`);
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/comps/${params.compId}/edit`);
  };

  const handleConfirmDeleteClicked = async () => {
    try {
      await deleteCompetition(params.compId, session);
      router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/comps`));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    // wait for the session: unlisted events are only returned to authenticated admins
    if (status === 'loading') return;

    getEvent(params.eventId, session)
      .then((event: Event) => {
        setEvent(event);
      })
      .catch(() => {
        router.push(routeEventNotFound);
      });

    getCompetition(params.compId).then((comp: Competition) => {
      setComp(comp);
    });
  }, [status]);

  if (!event) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgDeleteCompetitionTitle')} queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{t('dlgDeleteCompetitionText')}</p>
      </Dialog>

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} description={comp?.name} />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-content flex-col items-center gap-4">
            <div className="w-full max-w-3xl">
              <CompWorkflowSteps eventId={params.eventId} compId={params.compId} current="details" />
            </div>
            <CompetitionEditor
              event={event}
              editorMode={EditorMode.EDIT}
              comp={comp}
              onCompUpdate={(comp: Competition) => {
                setComp(comp);
              }}
            />
          </div>
        </div>

        <Navigation>
          <ActionButton action={Action.CANCEL} onClick={() => router.replace(`${routeEvents}/${params.eventId}/comps`)} />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />

            <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSaveClicked}>
              {t('btnSave')}
            </Button>
          </div>
        </Navigation>
      </div>
    </>
  );
}
