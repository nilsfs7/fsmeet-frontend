import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import { useState } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker } from '@mui/x-date-pickers';

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
  const [dateFrom, setDateFrom] = useState<Moment>(moment().add(7, 'day'));
  const [dateTo, setDateTo] = useState<Moment>(moment().add(7, 'day'));
  const [registrationCosts, setRegistrationCosts] = useState('25');
  const [registrationDeadline, setRegistrationDeadline] = useState(moment().add(5, 'day'));
  const [description, setDescription] = useState('German Championship in Freestyle Football 2023');
  const [location, setLocation] = useState('Heilbronn');
  const [type, setType] = useState('Competition');

  const hanldeDateFromChanged = (moment: Moment | null) => {
    if (moment) {
      setDateFrom(moment);
    }
  };

  const hanldeDateToChanged = (moment: Moment | null) => {
    if (moment) {
      setDateTo(moment);
    }
  };

  const hanldeDeadlineChanged = (moment: Moment | null) => {
    if (moment) {
      setRegistrationDeadline(moment);
    }
  };

  const handleCreateClicked = async () => {
    console.log(dateFrom.unix());
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'POST',
      body: JSON.stringify({
        name: eventName,
        dateFrom: dateFrom.unix(),
        dateTo: dateTo.unix(),
        registrationCosts: registrationCosts,
        registrationDeadline: registrationDeadline.unix(),
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
      router.replace('/events/subs');
    }
  };

  return (
    <div className={'flex columns-1 flex-col items-center'}>
      <h1 className="m-2 text-xl">Create Event</h1>
      <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
        <TextInput
          id={'name'}
          label={'Event Name'}
          placeholder="GFFC 2023"
          onChanged={e => {
            setEventName(e.currentTarget.value);
          }}
        />

        <div className="m-2 grid grid-cols-2">
          <div className="p-2">Date From</div>
          <DatePicker value={dateFrom} onChange={newDate => hanldeDateFromChanged(newDate)} />
        </div>

        <div className="m-2 grid grid-cols-2">
          <div className="p-2">Date To</div>
          <DatePicker value={dateTo} onChange={newDate => hanldeDateToChanged(newDate)} />
        </div>

        <div className="m-2 grid grid-cols-2">
          <div className="p-2">Registration Deadline</div>
          <DatePicker value={registrationDeadline} onChange={newDate => hanldeDeadlineChanged(newDate)} />
        </div>

        <TextInput
          id={'registrationCosts'}
          label={'Participation Fee'}
          placeholder="25"
          onChanged={e => {
            setRegistrationCosts(e.currentTarget.value);
          }}
        />

        <TextInput
          id={'description'}
          label={'Event Description'}
          placeholder="German Championship"
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
        <div className="p-2">
          <Button text={'Cancel'} onClick={() => router.back()} />{' '}
        </div>
        <div className="p-2">
          <Button text={'Create Event'} onClick={handleCreateClicked} />
        </div>
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
