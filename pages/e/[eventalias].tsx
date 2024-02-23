import { getEventByAlias } from '@/services/fsmeet-backend/get-event-by-alias';
import { routeEvents } from '@/types/consts/routes';
import { GetServerSidePropsContext } from 'next';

const EventAlias = () => {
  // TODO
  return <>No event found</>;
};

export default EventAlias;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const alias = context.params?.eventalias;

  // TODO: bug -> url funktioniert nicht für events ohne public state
  if (alias) {
    try {
      const event = await getEventByAlias(alias.toString());

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
    props: {},
  };
};
