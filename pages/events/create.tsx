import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import router from 'next/router';
import { useState } from 'react';

export type CreateEvent = {
  name: string;
  dateFrom: number;
  dateTo: number;
  registrationCosts: number;
  registrationDeadline: number;
  description: string;
  location: string;
  type: string;
};

const EventCreation = (props: any) => {
  const session = props.session;

  if (!session) {
    router.push('/login');
  }

  const [eventName, setEventName] = useState('GFFC 2023');
  const [startDate, setDateFrom] = useState('1665828000');
  const [dateTo, setDateTo] = useState('1666939000');
  const [registrationCosts, setRegistrationCosts] = useState('25');
  const [registrationDeadline, setRegistrationDeadline] = useState('1665007199');
  const [description, setDescription] = useState('German Championship in Freestyle Football 2023');
  const [location, setLocation] = useState('Heilbronn');
  const [type, setType] = useState('Competition');

  const handleCreateClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'POST',
      body: JSON.stringify({
        name: eventName,
        dateFrom: startDate,
        dateTo: dateTo,
        registrationCosts: registrationCosts,
        registrationDeadline: registrationDeadline,
        description: description,
        location: location,
        type: type,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.replace('/events');
    }
  };

  return (
    <div className={'flex flex-col items-center'}>
      <h1 className="m-2 text-xl">Create Event</h1>
      <div className="m-2 flex flex-col items-center rounded-lg bg-zinc-300 p-1">
        <TextInput
          id={'name'}
          label={'Event Name'}
          placeholder="GFFC 2023"
          onChanged={e => {
            setEventName(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'dateFrom'}
          label={'Start Date'}
          placeholder="1665828000"
          onChanged={e => {
            setDateFrom(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'dateTo'}
          label={'End Date'}
          placeholder="1666939000"
          onChanged={e => {
            setDateTo(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'registrationCosts'}
          label={'Participation Fee'}
          placeholder="25"
          onChanged={e => {
            setRegistrationCosts(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'registrationDeadline'}
          label={'Registration Deadline'}
          placeholder="1665007199"
          onChanged={e => {
            setRegistrationDeadline(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'description'}
          label={'Event Description'}
          placeholder="German Championship in Freestyle Football 2023"
          onChanged={e => {
            setDescription(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'location'}
          label={'Location / City'}
          placeholder="Heilbronn"
          onChanged={e => {
            setLocation(e.currentTarget.value);
          }}
        />
        <TextInput
          id={'type'}
          label={'type'}
          placeholder="Competition"
          onChanged={e => {
            setType(e.currentTarget.value);
          }}
        />
      </div>
      <div className="m-2 flex">
        <Link href="/events">
          <Button text={'Cancel'} />
        </Link>

        <Button text={'Create Event'} onClick={handleCreateClicked} />
      </div>
    </div>
  );
};

export default EventCreation;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
