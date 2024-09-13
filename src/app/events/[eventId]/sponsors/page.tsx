import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { RedirectType, redirect } from 'next/navigation';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import Separator from '@/components/Seperator';

export default async function EventSponsors({ params }: { params: { eventId: string } }) {
  const session = await auth();

  // TODO: remove because redirect is done by middleware anyway
  if (!session?.user?.username) {
    redirect(routeLogin, RedirectType.replace);
  }

  const sponsors = await getSponsors(params.eventId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Manage Sponsors" />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="flex flex-col">
          {sponsors.map((sponsor, index) => {
            return (
              <div key={index} className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">
                  <div>{sponsor.name}</div>
                </div>

                <div className="mx-1 flex w-1/2 justify-start">
                  <Link href={`${routeEvents}/${params.eventId}/sponsors/${sponsor.id}/edit`}>
                    <ActionButton action={Action.EDIT} />
                  </Link>
                </div>
              </div>
            );
          })}

          <div className="my-1">
            <Separator />
          </div>

          <div className="m-1 flex items-center gap-2">
            <div className="flex w-1/2 justify-end">Add new</div>
            <div className="flex w-1/2">
              <Link href={`${routeEvents}/${params.eventId}/sponsors/create`}>
                <ActionButton action={Action.ADD} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        <Link href={`${routeEvents}/${params.eventId}`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
