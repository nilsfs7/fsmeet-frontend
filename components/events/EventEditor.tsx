import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { DatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';

export type Event = {
  id: string | undefined;
  name: string | undefined;
  dateFrom: Moment;
  dateTo: Moment;
  registrationCosts: number | undefined;
  registrationDeadline: Moment;
  description: string | undefined;
  location: string | undefined;
  type: string | undefined;
};

interface IEventEditorProps {
  event?: Event;
  onEventUpdate: (event: Event) => void;
}

const EventEditor = ({ event, onEventUpdate }: IEventEditorProps) => {
  const [name, setEventName] = useState(event?.name);
  const [dateFrom, setDateFrom] = useState<Moment>(event?.dateFrom ? event?.dateFrom : moment().add(7, 'day'));
  const [dateTo, setDateTo] = useState<Moment>(event?.dateTo ? event?.dateTo : moment().add(7, 'day'));
  const [registrationCosts, setRegistrationCosts] = useState(event?.registrationCosts);
  const [registrationDeadline, setRegistrationDeadline] = useState(event?.registrationDeadline ? event?.registrationDeadline : moment().add(7, 'day'));
  const [description, setDescription] = useState(event?.description);
  const [location, setLocation] = useState(event?.location);
  const [type, setType] = useState(event?.type);

  const updateEvent = () => {
    onEventUpdate({
      id: event?.id,
      name: name,
      dateFrom: dateFrom,
      dateTo: dateTo,
      registrationCosts: registrationCosts,
      registrationDeadline: registrationDeadline,
      description: description,
      location: location,
      type: type,
    });
  };

  // updates inputs with given event
  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setDateFrom(event.dateFrom);
      setDateTo(event.dateTo);
      setRegistrationCosts(event.registrationCosts);
      setRegistrationDeadline(event.registrationDeadline);
      setDescription(event.description);
      setLocation(event.location);
      setType(event.type);
    }
  }, [event]);

  // fires event back
  useEffect(() => {
    updateEvent();
  }, [name, dateFrom, dateTo, registrationCosts, registrationDeadline, description, location, type]);

  return (
    <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
      <TextInput
        id={'name'}
        label={'Event Name'}
        placeholder="GFFC 2023"
        defValue={name}
        onChanged={e => {
          setEventName(e.currentTarget.value);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div className="p-2">Date From</div>
        <DatePicker
          value={dateFrom}
          onChange={value => {
            if (value) {
              setDateFrom(value);
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div className="p-2">Date To</div>
        <DatePicker
          value={dateTo}
          onChange={value => {
            if (value) {
              setDateTo(value);
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div className="p-2">Registration Deadline</div>
        <DatePicker
          value={registrationDeadline}
          onChange={value => {
            if (value) {
              setRegistrationDeadline(value);
            }
          }}
        />
      </div>

      <TextInput
        id={'registrationCosts'}
        label={'Participation Fee'}
        placeholder="25"
        defValue={registrationCosts ? registrationCosts.toString() : undefined}
        onChanged={e => {
          setRegistrationCosts(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'description'}
        label={'Event Description'}
        placeholder="German Championship"
        defValue={description}
        onChanged={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'location'}
        label={'Location / City'}
        placeholder="Heilbronn"
        defValue={location}
        onChanged={e => {
          setLocation(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'type'}
        label={'type'}
        placeholder="Competition"
        defValue={type}
        onChanged={e => {
          setType(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default EventEditor;
