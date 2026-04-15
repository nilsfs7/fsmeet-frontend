import { Header } from '@/components/header';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { ArenaCompetitionPicker } from './components/arena-competition-picker';
import { ArenaScreenSettings } from './components/arena-screen-settings';
import { OpenArenaPreviewButton } from './components/open-arena-preview-button';

export default async function ArenaScreen(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const competitions = await getCompetitions(params.eventId);

  const options = competitions.filter((c): c is typeof c & { id: string } => Boolean(c.id)).map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header showMenu={true} />
      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        <h1 className="text-xl font-semibold text-primary">Arena screen</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a match for the live preview.</p>
        <ArenaCompetitionPicker eventId={params.eventId} competitions={options} />
        <div className="mt-6">
          <OpenArenaPreviewButton eventId={params.eventId} />
        </div>
        <ArenaScreenSettings eventId={params.eventId} />
      </div>
    </div>
  );
}
