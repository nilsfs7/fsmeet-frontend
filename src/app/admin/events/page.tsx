import PageTitle from '@/components/page-title';
import { EventsEditor } from './components/events-editor';

export default function EventAdministration() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title="Manage Events" />
      <EventsEditor />
    </div>
  );
}
