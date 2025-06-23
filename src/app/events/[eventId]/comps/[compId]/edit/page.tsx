'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { routeEventNotFound, routeEvents } from '@/domain/constants/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { Competition } from '@/types/competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Event } from '@/types/event';
import Dialog from '@/components/Dialog';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import PageTitle from '@/components/PageTitle';
import { getEvent } from '@/infrastructure/clients/event.client';
import { deleteCompetition, getCompetition, updateCompetition } from '@/infrastructure/clients/competition.client';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { CurrencyCode } from '@/domain/enums/currency-code';

export default function CompetitionEditing({ params }: { params: { eventId: string; compId: string } }) {
  const t = useTranslations('/events/eventid/comps/edit');

  const { data: session } = useSession();
  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [comp, setComp] = useState<Competition>();

  const handleSaveClicked = async () => {
    if (comp) {
      try {
        await updateCompetition(comp, session);
        toast.success(`Competition successfully updated`);
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
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgDeleteCompetitionTitle')} queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{t('dlgDeleteCompetitionText')}</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
            editorMode={EditorMode.EDIT}
            currency={event?.currency || CurrencyCode.EUR}
            comp={comp}
            onCompUpdate={(comp: Competition) => {
              setComp(comp);
            }}
          />
        </div>

        <Navigation>
          <ActionButton action={Action.CANCEL} onClick={() => router.replace(`${routeEvents}/${params.eventId}/comps`)} />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />

            <TextButton text={t('btnSave')} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
