'use client';

import TextButton from '@/components/common/text-button';
import { useRouter } from 'next/navigation';
import { useState, use, useEffect } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import CompetitionEditor from '@/components/events/competition-editor';
import { Competition } from '@/domain/types/competition';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { createCompetition } from '@/infrastructure/clients/competition.client';
import NavigateBackButton from '@/components/navigate-back-button';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { Event } from '@/domain/types/event';
import { getEvent } from '@/infrastructure/clients/event.client';
import LoadingSpinner from '@/components/animation/loading-spinner';

export default function CompetitionCreation(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/comps/create');
  const { data: session } = useSession();
  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [comp, setComp] = useState<Competition>();

  const handleCreateClicked = async () => {
    if (comp) {
      try {
        await createCompetition(params.eventId, comp, session);
        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/comps`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getEvent(params.eventId, session).then(event => {
      setEvent(event);
    });
  }, [event === undefined]);

  if (!event) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
            event={event}
            editorMode={EditorMode.CREATE}
            onCompUpdate={(comp: Competition) => {
              setComp(comp);
            }}
          />
        </div>

        <Navigation>
          <NavigateBackButton />
          <TextButton text={t('btnCreate')} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
}
