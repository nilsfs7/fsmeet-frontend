import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { DatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { Event } from '@/types/event';
import { EventType } from '@/types/enums/event-type';
import Dropdown from './Dropdown';

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
  const [eventType, setEventType] = useState<EventType>(event?.type || EventType.COMPETITION);

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
      type: eventType,
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
      setEventType(event.type);
    }
  }, [event]);

  // fires event back
  useEffect(() => {
    updateEvent();
  }, [name, dateFrom, dateTo, registrationCosts, registrationDeadline, description, location, eventType]);

  return (
    <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
      <TextInput
        id={'name'}
        label={'Event Name'}
        placeholder="GFFC 2023"
        value={name}
        onChange={e => {
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
        value={registrationCosts ? registrationCosts.toString() : undefined}
        onChange={e => {
          setRegistrationCosts(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'description'}
        label={'Event Description'}
        placeholder="German Championship"
        value={description}
        onChange={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'location'}
        label={'Location / City'}
        placeholder="Heilbronn"
        value={location}
        onChange={e => {
          setLocation(e.currentTarget.value);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div className="p-2">Type</div>
        <Dropdown
          defaultValue={event?.type || EventType.COMPETITION}
          onChange={(value: EventType) => {
            setEventType(value);
          }}
        />
      </div>
    </div>
  );
};

export default EventEditor;
