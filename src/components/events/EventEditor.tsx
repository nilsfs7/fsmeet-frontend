import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import moment from 'moment';
import { Event } from '@/types/event';
import { EventType } from '@/types/enums/event-type';
import CheckBox from '../common/CheckBox';
import TextInputLarge from '../common/TextInputLarge';
import { PaymentMethodCash } from '@/types/payment-method-cash';
import { PaymentMethodPayPal } from '@/types/payment-method-paypal';
import { PaymentMethodSepa } from '@/types/payment-method-sepa';
import ComboBox from '../common/ComboBox';
import { menuEventTypes } from '@/types/consts/menus/menu-event-types';
import { validateAlias } from '@/types/funcs/validation/validation-event';
import CurInput from '../common/CurrencyInput';
import { EventState } from '@/types/enums/event-state';
import { DatePicker } from '../common/DatePicker';
import { EditorMode } from '@/types/enums/editor-mode';
import Separator from '../Seperator';
import SectionHeader from '../common/section-header';
import Link from 'next/link';
import { routeEvents } from '@/types/consts/routes';

interface IEventEditorProps {
  editorMode: EditorMode;
  event?: Event;
  onEventUpdate: (event: Event) => void;
}

const EventEditor = ({ editorMode, event, onEventUpdate }: IEventEditorProps) => {
  const [name, setEventName] = useState(event?.name || '');
  const [alias, setEventAlias] = useState(event?.alias || '');
  const [dateFrom, setDateFrom] = useState<string>(event?.dateFrom ? event.dateFrom : moment().startOf('day').add(7, 'day').utc().format());
  const [dateTo, setDateTo] = useState<string>(event?.dateTo ? event.dateTo : moment().endOf('day').add(7, 'day').utc().format());
  const [registrationOpen, setRegistrationOpen] = useState<string>(event?.registrationDeadline ? event.registrationDeadline : moment().startOf('day').utc().format());
  const [registrationDeadline, setRegistrationDeadline] = useState<string>(event?.registrationDeadline ? event.registrationDeadline : moment().endOf('day').add(6, 'day').utc().format());
  const [description, setDescription] = useState(event?.description || '');
  const [venueHouseNo, setVenueHouseNo] = useState(event?.venueCity || '');
  const [venueStreet, setVenueStreet] = useState(event?.venueCity || '');
  const [venueCity, setVenueCity] = useState(event?.venueCity || '');
  const [venuePostCode, setVenuePostCode] = useState(event?.venueCity || '');
  const [venueCountry, setVenueCountry] = useState(event?.venueCity || '');
  const [eventType, setEventType] = useState<EventType>(event?.type || EventType.COMPETITION);
  const [livestreamUrl, setLivestreamUrl] = useState(event?.livestreamUrl || '');
  const [participationFee, setParticipationFee] = useState(event?.participationFee || 0.0);
  const [paymentMethodCashEnabled, setPaymentMethodCashEnabled] = useState<boolean>(event?.paymentMethodCash?.enabled || false);
  const [paymentMethodPayPalEnabled, setPaymentMethodPayPalEnabled] = useState<boolean>(event?.paymentMethodPayPal?.enabled || false);
  const [paymentMethodPayPalHandle, setPaymentMethodPayPalHandle] = useState<string>(event?.paymentMethodPayPal?.payPalHandle || '');
  const [paymentMethodSepaEnabled, setPaymentMethodSepaEnabled] = useState<boolean>(event?.paymentMethodSepa?.enabled || false);
  const [paymentMethodSepaBank, setPaymentMethodSepaBank] = useState<string>(event?.paymentMethodSepa?.bank || '');
  const [paymentMethodSepaRecipient, setPaymentMethodSepaRecipient] = useState<string>(event?.paymentMethodSepa?.recipient || '');
  const [paymentMethodSepaIban, setPaymentMethodSepaIban] = useState<string>(event?.paymentMethodSepa?.iban || '');
  const [paymentMethodSepaReference, setPaymentMethodSepaReference] = useState<string>(event?.paymentMethodSepa?.reference || '');
  const [autoApproveRegistrations, setAutoApproveRegistrations] = useState<boolean>(event?.autoApproveRegistrations || false);
  const [notifyOnRegistration, setNotifyOnRegistration] = useState<boolean>(event?.notifyOnRegistration || true);
  const [allowComments, setAllowComments] = useState<boolean>(event?.allowComments || true);
  const [notifyOnComment, setNotifyOnComment] = useState<boolean>(event?.notifyOnComment || true);

  const handleInputChangeAlias = (event: any) => {
    let alias: string = event.currentTarget.value;
    alias = alias.toLowerCase();

    if (validateAlias(alias)) {
      setEventAlias(alias.toLowerCase());
    }
  };

  const updateEvent = () => {
    const paymentMethodCash: PaymentMethodCash = { enabled: paymentMethodCashEnabled };
    const paymentMethodPayPal: PaymentMethodPayPal = {
      enabled: paymentMethodPayPalEnabled,
      payPalHandle: paymentMethodPayPalHandle,
    };
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
      paymentMethodPayPal: paymentMethodPayPal,
      paymentMethodSepa: paymentMethodSepa,
      autoApproveRegistrations: autoApproveRegistrations,
      notifyOnRegistration: notifyOnRegistration,
      allowComments: allowComments,
      notifyOnComment: notifyOnComment,
      eventRegistrations: [],
      competitions: [],
      state: event?.state || EventState.CREATED,
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
      setPaymentMethodPayPalEnabled(event.paymentMethodPayPal.enabled);
      setPaymentMethodPayPalHandle(event.paymentMethodPayPal.payPalHandle);
      setPaymentMethodSepaEnabled(event.paymentMethodSepa.enabled);
      setPaymentMethodSepaBank(event.paymentMethodSepa.bank);
      setPaymentMethodSepaRecipient(event.paymentMethodSepa.recipient);
      setPaymentMethodSepaIban(event.paymentMethodSepa.iban);
      setPaymentMethodSepaReference(event.paymentMethodSepa.reference);
      setAutoApproveRegistrations(event.autoApproveRegistrations);
      setNotifyOnRegistration(event.notifyOnRegistration);
      setAllowComments(event.allowComments);
      setNotifyOnComment(event.notifyOnComment);
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
    paymentMethodPayPalEnabled,
    paymentMethodPayPalHandle,
    paymentMethodSepaEnabled,
    paymentMethodSepaBank,
    paymentMethodSepaRecipient,
    paymentMethodSepaIban,
    paymentMethodSepaReference,
    autoApproveRegistrations,
    notifyOnRegistration,
    allowComments,
    notifyOnComment,
  ]);

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1 overflow-y-auto">
      <SectionHeader label={`General`} />

      <TextInput
        id={'name'}
        label={'Event Name'}
        placeholder="German Freestyle Football Championship 2023"
        value={name}
        onChange={(e) => {
          setEventName(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'alias'}
        label={'Event Alias'}
        placeholder="gffc2023"
        value={alias}
        onChange={(e) => {
          handleInputChangeAlias(e);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div>{`Type`}</div>
        <div className="flex w-full">
          {editorMode === EditorMode.CREATE && (
            <ComboBox
              menus={menuEventTypes}
              value={eventType}
              onChange={(value: EventType) => {
                setEventType(value);
              }}
            />
          )}
          {editorMode === EditorMode.EDIT && <div>{menuEventTypes.find((item) => item.value === eventType)?.text}</div>}
        </div>
      </div>

      {event?.state && (
        <div className="m-2 grid grid-cols-2 items-center">
          <div>{'Event State'}</div>
          <Link href={`${routeEvents}/${event.id}?state=1`}>
            <label id={'eventState'} className="w-full hover:underline">
              {(event?.state.charAt(0).toUpperCase() + event?.state.slice(1)).replaceAll('_', ' ')}
            </label>
          </Link>
        </div>
      )}

      <TextInputLarge
        id={'description'}
        label={'Event Description'}
        placeholder="German Championship"
        value={description}
        resizable={true}
        onChange={(e) => {
          setDescription(e.currentTarget.value);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div>{`Date From`}</div>
        <DatePicker
          date={moment(dateFrom)}
          onChange={(value) => {
            if (value) {
              setDateFrom(value.startOf('day').utc().format());
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{`Date To`}</div>
        <DatePicker
          date={moment(dateTo)}
          onChange={(value) => {
            if (value) {
              setDateTo(value.endOf('day').utc().format());
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{`Registration Open`}</div>
        <DatePicker
          date={moment(registrationOpen)}
          onChange={(value) => {
            if (value) {
              setRegistrationOpen(value.startOf('day').utc().format());
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{`Registration Deadline`}</div>
        <DatePicker
          date={moment(registrationDeadline)}
          onChange={(value) => {
            if (value) {
              setRegistrationDeadline(value.endOf('day').utc().format());
            }
          }}
        />
      </div>

      <TextInput
        id={'livestreamUrl'}
        label={'Livestream URL'}
        placeholder="https://www.youtube.com/watch?v=gwiE0fXnByg"
        value={livestreamUrl}
        onChange={(e) => {
          setLivestreamUrl(e.currentTarget.value);
        }}
      />

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={`Location`} />

      {eventType != EventType.COMPETITION_ONLINE && (
        <>
          <TextInput
            id={'venueHouseNo'}
            label={'House No'}
            placeholder="40/1"
            value={venueHouseNo}
            onChange={(e) => {
              setVenueHouseNo(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venueStreet'}
            label={'Street'}
            placeholder="Hofwiesenstraße"
            value={venueStreet}
            onChange={(e) => {
              setVenueStreet(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venuePostCode'}
            label={'Post Code'}
            placeholder="74081"
            value={venuePostCode}
            onChange={(e) => {
              setVenuePostCode(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venueCity'}
            label={'City'}
            placeholder="Heilbronn"
            value={venueCity}
            onChange={(e) => {
              setVenueCity(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venueCountry'}
            label={'Country'}
            placeholder="Germany"
            value={venueCountry}
            onChange={(e) => {
              setVenueCountry(e.currentTarget.value);
            }}
          />
        </>
      )}

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={`Payment`} />

      <CurInput
        id={'participationFee'}
        label={'Participation Fee'}
        placeholder="25,00"
        value={participationFee}
        onValueChange={(value, name, values) => {
          if (values?.float || values?.float == 0) {
            setParticipationFee(values?.float);
          }
        }}
      />

      {participationFee > 0 && (
        <>
          <CheckBox
            id={'paymentMethodCashEnabled'}
            label="Accept Cash"
            value={paymentMethodCashEnabled}
            onChange={() => {
              setPaymentMethodCashEnabled(!paymentMethodCashEnabled);
            }}
          />

          <CheckBox
            id={'paymentMethodPayPalEnabled'}
            label="Accept PayPal"
            value={paymentMethodPayPalEnabled}
            onChange={() => {
              setPaymentMethodPayPalEnabled(!paymentMethodPayPalEnabled);
            }}
          />

          {paymentMethodPayPalEnabled && (
            <>
              <TextInput
                id={'paymentMethodPayPal'}
                label={'PayPal User Handle'}
                placeholder="username"
                value={paymentMethodPayPalHandle}
                onChange={(e) => {
                  setPaymentMethodPayPalHandle(e.currentTarget.value);
                }}
              />

              {paymentMethodPayPalHandle && (
                <div className="m-2 grid h-[100%] grid-cols-2">
                  <div>{`Verify PayPal Profile`}</div>

                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://paypal.me/${paymentMethodPayPalHandle}`}
                    className="h-full w-full hover:underline break-all"
                  >{`https://paypal.me/${paymentMethodPayPalHandle}`}</a>
                </div>
              )}
            </>
          )}

          <CheckBox
            id={'paymentMethodSepaEnabled'}
            label="Accept Bank Transfer (SEPA)"
            value={paymentMethodSepaEnabled}
            onChange={() => {
              setPaymentMethodSepaEnabled(!paymentMethodSepaEnabled);
            }}
          />

          {paymentMethodSepaEnabled && (
            <>
              <TextInput
                id={'paymentMethodSepaBank'}
                label={'SEPA Bank'}
                placeholder="DKB"
                value={paymentMethodSepaBank}
                onChange={(e) => {
                  setPaymentMethodSepaBank(e.currentTarget.value);
                }}
              />

              <TextInput
                id={'paymentMethodSepaRecipient'}
                label={'SEPA Recipient'}
                placeholder="DFFB e.V."
                value={paymentMethodSepaRecipient}
                onChange={(e) => {
                  setPaymentMethodSepaRecipient(e.currentTarget.value);
                }}
              />

              <TextInput
                id={'paymentMethodSepaIban'}
                label={'SEPA IBAN'}
                placeholder="DE123"
                value={paymentMethodSepaIban}
                onChange={(e) => {
                  setPaymentMethodSepaIban(e.currentTarget.value);
                }}
              />

              <TextInput
                id={'paymentMethodSepaReference'}
                label={'SEPA Reference'}
                placeholder="superball-2023"
                value={paymentMethodSepaReference}
                onChange={(e) => {
                  setPaymentMethodSepaReference(e.currentTarget.value);
                }}
              />
            </>
          )}
        </>
      )}

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={`Other`} />

      <CheckBox
        id={'autoApproveRegistrations'}
        label="Auto Approve Registrations"
        value={autoApproveRegistrations}
        onChange={() => {
          setAutoApproveRegistrations(!autoApproveRegistrations);
        }}
      />
      <CheckBox
        id={'notifyOnRegistration'}
        label="Notify On Registration"
        value={notifyOnRegistration}
        onChange={() => {
          setNotifyOnRegistration(!notifyOnRegistration);
        }}
      />
      <CheckBox
        id={'allowComments'}
        label="Allow Comments And Questions"
        value={allowComments}
        onChange={() => {
          setAllowComments(!allowComments);
        }}
      />
      {allowComments && (
        <CheckBox
          id={'notifyOnComment'}
          label="Notify On Comment"
          value={notifyOnComment}
          onChange={() => {
            setNotifyOnComment(!notifyOnComment);
          }}
        />
      )}
    </div>
  );
};

export default EventEditor;
