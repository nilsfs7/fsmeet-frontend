import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { Event } from '@/types/event';
import { EventType } from '@/types/enums/event-type';
import CheckBox from '../common/CheckBox';
import TextInputLarge from '../common/TextInputLarge';
import { PaymentMethodCash } from '@/types/payment-method-cash';
import { PaymentMethodSepa } from '@/types/payment-method-sepa';
import ComboBox from '../common/ComboBox';
import { menuEventTypes } from '@/types/consts/menus/menu-event-types';
import { validateAlias } from '@/types/funcs/validation/validation-event';
import { timeMid } from '@/types/funcs/time';

interface IEventEditorProps {
  event?: Event;
  onEventUpdate: (event: Event) => void;
}

const EventEditor = ({ event, onEventUpdate }: IEventEditorProps) => {
  const [name, setEventName] = useState(event?.name || '');
  const [alias, setEventAlias] = useState(event?.alias || '');
  const [dateFrom, setDateFrom] = useState<string>(event?.dateFrom ? event.dateFrom : timeMid(moment()).add(7, 'day').utc().format());
  const [dateTo, setDateTo] = useState<string>(event?.dateTo ? event.dateTo : timeMid(moment()).add(7, 'day').utc().format());
  const [registrationOpen, setRegistrationOpen] = useState<string>(event?.registrationDeadline ? event.registrationDeadline : timeMid(moment()).utc().format());
  const [registrationDeadline, setRegistrationDeadline] = useState<string>(event?.registrationDeadline ? event.registrationDeadline : timeMid(moment()).add(6, 'day').utc().format());
  const [description, setDescription] = useState(event?.description || '');
  const [venueHouseNo, setVenueHouseNo] = useState(event?.venueCity || '');
  const [venueStreet, setVenueStreet] = useState(event?.venueCity || '');
  const [venueCity, setVenueCity] = useState(event?.venueCity || '');
  const [venuePostCode, setVenuePostCode] = useState(event?.venueCity || '');
  const [venueCountry, setVenueCountry] = useState(event?.venueCity || '');
  const [eventType, setEventType] = useState<EventType>(event?.type || EventType.COMPETITION);
  const [livestreamUrl, setLivestreamUrl] = useState(event?.livestreamUrl || '');
  const [participationFee, setParticipationFee] = useState(event?.participationFee || 0);
  const [paymentMethodCashEnabled, setPaymentMethodCashEnabled] = useState<boolean>(event?.paymentMethodCash?.enabled || false);
  const [paymentMethodSepaEnabled, setPaymentMethodSepaEnabled] = useState<boolean>(event?.paymentMethodSepa?.enabled || false);
  const [paymentMethodSepaBank, setPaymentMethodSepaBank] = useState<string>(event?.paymentMethodSepa?.bank || '');
  const [paymentMethodSepaRecipient, setPaymentMethodSepaRecipient] = useState<string>(event?.paymentMethodSepa?.recipient || '');
  const [paymentMethodSepaIban, setPaymentMethodSepaIban] = useState<string>(event?.paymentMethodSepa?.iban || '');
  const [paymentMethodSepaReference, setPaymentMethodSepaReference] = useState<string>(event?.paymentMethodSepa?.reference || '');
  const [autoApproveRegistrations, setAutoApproveRegistrations] = useState<boolean>(event?.autoApproveRegistrations || false);
  const [published, setPublished] = useState<boolean>(event?.published || false);

  const handleInputChangeAlias = (event: any) => {
    let alias: string = event.currentTarget.value;
    alias = alias.toLowerCase();

    if (validateAlias(alias)) {
      setEventAlias(alias.toLowerCase());
    }
  };

  const updateEvent = () => {
    const paymentMethodCash: PaymentMethodCash = { enabled: paymentMethodCashEnabled };
    const paymentMethodSepa: PaymentMethodSepa = {
      enabled: paymentMethodSepaEnabled,
      bank: paymentMethodSepaBank,
      recipient: paymentMethodSepaRecipient,
      iban: paymentMethodSepaIban,
      reference: paymentMethodSepaReference,
    };

    onEventUpdate({
      id: event?.id,
      name: name,
      alias: alias,
      admin: event?.admin,
      type: eventType,
      description: description,
      dateFrom: dateFrom,
      dateTo: dateTo,
      registrationOpen: registrationOpen,
      registrationDeadline: registrationDeadline,
      venueHouseNo: venueHouseNo,
      venueStreet: venueStreet,
      venueCity: venueCity,
      venuePostCode: venuePostCode,
      venueCountry: venueCountry,
      livestreamUrl: livestreamUrl,
      participationFee: participationFee,
      paymentMethodCash: paymentMethodCash,
      paymentMethodSepa: paymentMethodSepa,
      autoApproveRegistrations: autoApproveRegistrations,
      eventRegistrations: [],
      eventCompetitions: [],
      published: published,
    });
  };

  // updates inputs with given event
  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setEventAlias(event.alias);
      setDateFrom(event.dateFrom);
      setDateTo(event.dateTo);
      setParticipationFee(event.participationFee);
      setRegistrationOpen(event.registrationOpen);
      setRegistrationDeadline(event.registrationDeadline);
      setDescription(event.description);
      setVenueHouseNo(event.venueHouseNo);
      setVenueStreet(event.venueStreet);
      setVenuePostCode(event.venuePostCode);
      setVenueCity(event.venueCity);
      setVenueCountry(event.venueCountry);
      setEventType(event.type);
      setLivestreamUrl(event.livestreamUrl);
      setPaymentMethodCashEnabled(event.paymentMethodCash.enabled);
      setPaymentMethodSepaEnabled(event.paymentMethodSepa.enabled);
      setPaymentMethodSepaBank(event.paymentMethodSepa.bank);
      setPaymentMethodSepaRecipient(event.paymentMethodSepa.recipient);
      setPaymentMethodSepaIban(event.paymentMethodSepa.iban);
      setPaymentMethodSepaReference(event.paymentMethodSepa.reference);
      setAutoApproveRegistrations(event.autoApproveRegistrations);
      setPublished(event.published);
    }
  }, [event]);

  // fires back event
  useEffect(() => {
    updateEvent();
  }, [
    name,
    alias,
    dateFrom,
    dateTo,
    registrationOpen,
    registrationDeadline,
    description,
    venueHouseNo,
    venueStreet,
    venueCity,
    venuePostCode,
    venueCountry,
    eventType,
    livestreamUrl,
    participationFee,
    paymentMethodCashEnabled,
    paymentMethodSepaEnabled,
    paymentMethodSepaBank,
    paymentMethodSepaRecipient,
    paymentMethodSepaIban,
    paymentMethodSepaReference,
    autoApproveRegistrations,
    published,
  ]);

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
      <TextInput
        id={'name'}
        label={'Event Name'}
        placeholder="Superball 2023"
        value={name}
        onChange={e => {
          setEventName(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'alias'}
        label={'Event Alias'}
        placeholder="superball2023"
        value={alias}
        onChange={e => {
          handleInputChangeAlias(e);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div>Type</div>
        <div className="flex w-full">
          <ComboBox
            menus={menuEventTypes}
            value={eventType}
            onChange={(value: EventType) => {
              setEventType(value);
            }}
          />
        </div>
      </div>

      <TextInputLarge
        id={'description'}
        label={'Event Description'}
        placeholder="German Championship"
        value={description}
        resizable={true}
        onChange={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div>Date From</div>
        <DatePicker
          value={moment(dateFrom)}
          onChange={value => {
            if (value) {
              setDateFrom(timeMid(value).utc().format());
            }
          }}
          timezone="system"
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>Date To</div>
        <DatePicker
          value={moment(dateTo)}
          onChange={value => {
            if (value) {
              setDateTo(timeMid(value).utc().format());
            }
          }}
          timezone="system"
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>Registration Open</div>
        <DatePicker
          value={moment(registrationOpen)}
          onChange={value => {
            if (value) {
              setRegistrationOpen(timeMid(value).utc().format());
            }
          }}
          timezone="system"
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>Registration Deadline</div>
        <DatePicker
          value={moment(registrationDeadline)}
          onChange={value => {
            if (value) {
              setRegistrationDeadline(timeMid(value).utc().format());
            }
          }}
          timezone="system"
        />
      </div>

      {/* venue address */}

      <TextInput
        id={'venueHouseNo'}
        label={'House No'}
        placeholder="40/1"
        value={venueHouseNo}
        onChange={e => {
          setVenueHouseNo(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'venueStreet'}
        label={'Street'}
        placeholder="Hofwiesenstraße"
        value={venueStreet}
        onChange={e => {
          setVenueStreet(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'venuePostCode'}
        label={'Post Code'}
        placeholder="74081"
        value={venuePostCode}
        onChange={e => {
          setVenuePostCode(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'venueCity'}
        label={'City'}
        placeholder="Heilbronn"
        value={venueCity}
        onChange={e => {
          setVenueCity(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'venueCountry'}
        label={'Country'}
        placeholder="Germany"
        value={venueCountry}
        onChange={e => {
          setVenueCountry(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'livestreamUrl'}
        label={'Livestream URL'}
        placeholder="https://www.youtube.com/watch?v=gwiE0fXnByg"
        value={livestreamUrl}
        onChange={e => {
          setLivestreamUrl(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'participationFee'}
        label={'Participation Fee'}
        placeholder="25"
        value={participationFee ? participationFee.toString() : '0'}
        onChange={e => {
          setParticipationFee(+e.currentTarget.value);
        }}
      />

      <CheckBox
        id={'paymentMethodCashEnabled'}
        label="Accept Cash"
        value={paymentMethodCashEnabled}
        onChange={() => {
          setPaymentMethodCashEnabled(!paymentMethodCashEnabled);
        }}
      />

      <CheckBox
        id={'paymentMethodSepaEnabled'}
        label="Accept Bank Transfer (SEPA)"
        value={paymentMethodSepaEnabled}
        onChange={() => {
          setPaymentMethodSepaEnabled(!paymentMethodSepaEnabled);
        }}
      />

      <TextInput
        id={'paymentMethodSepaBank'}
        label={'SEPA Bank'}
        placeholder="DKB"
        value={paymentMethodSepaBank}
        onChange={e => {
          setPaymentMethodSepaBank(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'paymentMethodSepaRecipient'}
        label={'SEPA Recipient'}
        placeholder="DFFB e.V."
        value={paymentMethodSepaRecipient}
        onChange={e => {
          setPaymentMethodSepaRecipient(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'paymentMethodSepaIban'}
        label={'SEPA IBAN'}
        placeholder="DE123"
        value={paymentMethodSepaIban}
        onChange={e => {
          setPaymentMethodSepaIban(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'paymentMethodSepaReference'}
        label={'SEPA Reference'}
        placeholder="superball-2023"
        value={paymentMethodSepaReference}
        onChange={e => {
          setPaymentMethodSepaReference(e.currentTarget.value);
        }}
      />

      <CheckBox
        id={'autoApproveRegistrations'}
        label="Auto Approve Registrations"
        value={autoApproveRegistrations}
        onChange={() => {
          setAutoApproveRegistrations(!autoApproveRegistrations);
        }}
      />

      <CheckBox
        id={'published'}
        label="Publish Event"
        value={published}
        onChange={() => {
          setPublished(!published);
        }}
      />
    </div>
  );
};

export default EventEditor;
