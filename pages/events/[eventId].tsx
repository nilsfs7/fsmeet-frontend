import { useRouter } from 'next/router';
import { IEvent } from '@/interface/event.js';
import EventCard from '@/components/events/EventCard';
import { useEffect, useState } from 'react';

const Event = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<IEvent>();

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
      const event = await response.json();
      setEvent(event);
    }
    fetchEvent();
  }, [event == undefined]);

  if (!event) {
    return 'loading...';
  }

  //   const openRegistration = () => {
  //     router.push(`/registration/${eventData.id}`);
  //   };

  return <EventCard event={event} />; // replace by event page with register option
};

export default Event;
