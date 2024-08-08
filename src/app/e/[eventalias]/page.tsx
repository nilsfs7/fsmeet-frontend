import { routeEventNotFound, routeEvents } from '@/types/consts/routes';
import { auth } from '@/auth';
import { RedirectType, redirect } from 'next/navigation';
import { getEventByAlias } from '@/infrastructure/clients/event.client';

export default async function EventAlias({ params }: { params: { eventalias: string } }) {
  const { eventalias } = params;

  const props = await getServerSideProps(eventalias);
  if (props?.redirect.destination) {
    redirect(props?.redirect.destination, RedirectType.replace);
  }

  return <></>;
}

async function getServerSideProps(alias: string) {
  const session = await auth();

  if (alias) {
    try {
      const event = await getEventByAlias(alias.toString(), session);

      if (event.id) {
        return {
          redirect: {
            destination: `${routeEvents}/${event.id}`,
          },
        };
      }
    } catch (error: any) {
      console.error('Error fetching event by alias.');
    }

    return {
      redirect: {
        destination: `${routeEventNotFound}`,
      },
    };
  }

  return;
}
