import { Header } from '@/components/header';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { routeEvents } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import Link from 'next/link';
import { ArenaCompetitionPicker } from './components/arena-competition-picker';
import { ArenaScreenSettings } from './components/arena-screen-settings';
import { OpenArenaPreviewButton } from './components/open-arena-preview-button';

export default async function ArenaScreen(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const competitions = await getCompetitions(params.eventId);

  const options = competitions.filter((c): c is typeof c & { id: string } => Boolean(c.id)).map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header showMenu={true} />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
        <h1 className="text-xl font-semibold text-primary">Arena screen</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a match for the live preview.</p>
        <ArenaCompetitionPicker eventId={params.eventId} competitions={options} />
        <div className="mt-6">
          <OpenArenaPreviewButton eventId={params.eventId} />
        </div>
        <ArenaScreenSettings eventId={params.eventId} />
      </div>

      <Navigation>
        <Link href={`${routeEvents}/${params.eventId}`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
