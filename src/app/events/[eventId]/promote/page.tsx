import PageTitle from '@/components/PageTitle';
import { QrEditor } from './components/qr-editor';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { RedirectType, redirect } from 'next/navigation';

export default async function Promote({ params }: { params: { eventId: string } }) {
  const session = await auth();

  // TODO: remove because redirect is done by middleware anyway
  if (!session?.user?.username) {
    redirect(routeLogin, RedirectType.replace);
  }

  const event = await getEvent(params.eventId, session);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Promote Event" />
      <QrEditor alias={event.alias} eventId={params.eventId} />

      <Navigation>
        <Link href={`${routeEvents}/${params.eventId}`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
