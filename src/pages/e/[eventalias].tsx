import { getEventByAlias } from '@/services/fsmeet-backend/get-event-by-alias';
import { routeEvents } from '@/types/consts/routes';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

const EventAlias = () => {
  return <></>;
};

export default EventAlias;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const alias = context.params?.eventalias;
  const session = await getSession(context);

  // TODO: bug -> url funktioniert nicht für events ohne public state
  if (alias) {
    try {
      const event = await getEventByAlias(alias.toString(), session);

      if (event.id) {
        return {
          redirect: {
            permanent: false,
            destination: `${routeEvents}/${event.id}`,
          },
          props: {},
        };
      }
    } catch (error: any) {
      console.error('Error fetching event by alias.');
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/events/notfound',
    },
    props: {},
  };
};
