import { Event } from '@/types/event';
import { GetServerSidePropsContext } from 'next';

const EventAlias = () => {
  // TODO
  return <>No event found</>;
};

export default EventAlias;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const alias = context.params?.eventalias;

  let event: Event;

  // TODO: bug -> url funktioniert nicht für events ohne public state
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/alias/${alias}`;
  try {
    const response = await fetch(url);
    if (response.status == 200) {
      event = await response.json();

      return {
        redirect: {
          permanent: false,
          destination: `/events/${event.id}`,
        },
        props: {},
      };
    }
  } catch (error: any) {
    console.error('Error fetching event by alias.');
  }

  return {
    props: {},
  };
};
