'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { Competition } from '@/types/competition';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { createCompetition } from '@/infrastructure/clients/competition.client';
import NavigateBackButton from '@/components/NavigateBackButton';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function CompetitionCreation({ params }: { params: { eventId: string } }) {
  const t = useTranslations('/events/eventid/comps/create');

  const { data: session } = useSession();
  const router = useRouter();

  const [comp, setComp] = useState<Competition>();

  const handleCreateClicked = async () => {
    if (comp) {
      try {
        await createCompetition(params.eventId, comp, session);
        router.replace(`${routeEvents}/${params.eventId}/comps`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
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
