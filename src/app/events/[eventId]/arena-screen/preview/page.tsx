import { ArenaPreviewLive } from './components/arena-preview-live';

export default async function ArenaScreen(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  return <ArenaPreviewLive eventId={params.eventId} />;
}
