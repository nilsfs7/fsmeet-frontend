'use client';

import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import TextInput from '../common/text-input';
import moment from 'moment';
import { Event } from '@/domain/types/event';
import { EventType } from '@/domain/enums/event-type';
import CheckBox from '../common/check-box';
import TextInputLarge from '../common/text-input-large';
import { PaymentMethodCash } from '@/domain/types/payment-method-cash';
import { PaymentMethodPayPal } from '@/domain/types/payment-method-paypal';
import { PaymentMethodSepa } from '@/domain/types/payment-method-sepa';
import ComboBox from '../common/combo-box';
import { menuEventTypes } from '@/domain/constants/menus/menu-event-types';
import { validateAlias } from '@/functions/validation/validation-event';
import CurInput from '../common/currency-input';
import { EventState } from '@/domain/enums/event-state';
import { DatePicker } from '../common/date-picker';
import { EditorMode } from '@/domain/enums/editor-mode';
import Separator from '../separator';
import Link from 'next/link';
import { routeAccount, routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import { EventMaintainer } from '@/domain/types/event-maintainer';
import UserCard from '../user/user-card';
import ActionButton from '../common/action-button';
import { Action } from '@/domain/enums/action';
import { User } from '@/domain/types/user';
import { getUser } from '@/infrastructure/clients/user.client';
import { isEventAdmin } from '@/functions/is-event-admin';
import { useSession } from 'next-auth/react';
import { PaymentMethodStripe } from '@/domain/types/payment-method-stripe';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { menuCountriesWithUnspecified } from '@/domain/constants/menus/menu-countries';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { deleteEventPoster } from '@/infrastructure/clients/event.client';
import { toast } from 'sonner';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { menuCurrencies } from '@/domain/constants/menus/menu-currencies';
import { EventCategory } from '@/domain/enums/event-category';
import { menuEventCategories } from '@/domain/constants/menus/menu-event-categories';
import { UserVerificationState } from '../../domain/enums/user-verification-state';
import { LicenseType } from '../../domain/enums/license-type';
import { cn } from '@/lib/utils';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
  '[&>div.m-2]:!m-0',
);
const FIELD_ROW_CLASS = 'flex min-w-0 flex-col gap-1.5 sm:grid sm:grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] sm:items-center sm:gap-3';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full sm:min-w-0';
const FIELD_CONTROL_TALL_INNER = 'flex min-h-10 w-full min-w-0 items-center';
const READONLY_VALUE_CLASS = 'min-w-0 text-sm text-foreground/90';
const FILE_INPUT_CLASS =
  'w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground';
const SECTION_H2 = 'text-sm font-semibold leading-tight text-foreground/90';

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={FIELD_ROW_CLASS}>
      <div className={FIELD_LABEL_CLASS}>{label}</div>
      <div className={FIELD_CONTROL_CLASS}>{children}</div>
    </div>
  );
}

interface IEventEditorProps {
  editorMode: EditorMode;
  users: User[];
  event?: Event;
  onEventUpdate: (event: Event) => void;
  onEventPosterUpdate: (image: File) => void;
}

const EventEditor = ({ editorMode, users, event, onEventUpdate, onEventPosterUpdate }: IEventEditorProps) => {
  const t = useTranslations('global/components/event-editor');

  const { data: session } = useSession();

  const [eventAdmin, setEventAdmin] = useState<User>();

  const [name, setEventName] = useState(event?.name || '');
  const [alias, setEventAlias] = useState(event?.alias || '');
  const [dateFrom, setDateFrom] = useState<string>(event?.dateFrom ? event.dateFrom : moment().startOf('day').add(7, 'day').utc().format());
  const [dateTo, setDateTo] = useState<string>(event?.dateTo ? event.dateTo : moment().endOf('day').add(7, 'day').utc().format());
  const [registrationOpen, setRegistrationOpen] = useState<string>(event?.registrationDeadline ? event.registrationDeadline : moment().startOf('day').utc().format());
  const [registrationDeadline, setRegistrationDeadline] = useState<string>(event?.registrationDeadline ? event.registrationDeadline : moment().endOf('day').add(6, 'day').utc().format());
  const [description, setDescription] = useState(event?.description || '');
  const [venueName, setVenueName] = useState(event?.venueName || '');
  const [venueHouseNo, setVenueHouseNo] = useState(event?.venueHouseNo || '');
  const [venueStreet, setVenueStreet] = useState(event?.venueStreet || '');
  const [venueCity, setVenueCity] = useState(event?.venueCity || '');
  const [venuePostCode, setVenuePostCode] = useState(event?.venuePostCode || '');
  const [venueCountryCode, setVenueCountryCode] = useState(event?.venueCountryCode || '');
  const [eventType, setEventType] = useState<EventType>(event?.type || EventType.COMPETITION);
  const [category, setEventCategory] = useState<EventCategory>(event?.category || EventCategory.NATIONAL);
  const [isWffaRanked, setIsWffaRanked] = useState(event?.isWffaRanked || false);
  const [priceMoney, setPriceMoney] = useState(event?.priceMoney || 0);
  const [trailerUrl, setTrailerUrl] = useState(event?.trailerUrl || null);
  const [livestreamUrl, setLivestreamUrl] = useState(event?.livestreamUrl || null);
  const [messangerInvitationUrl, setMessangerInvitationUrl] = useState(event?.messangerInvitationUrl || null);
  const [participationFee, setParticipationFee] = useState(event?.participationFee || 0);
  const [visitorFee, setVisitorFee] = useState(event?.visitorFee || 0);
  const [currency, setCurrency] = useState(event?.currency || CurrencyCode.EUR);
  const [paymentMethodCashEnabled, setPaymentMethodCashEnabled] = useState<boolean>(event?.paymentMethodCash?.enabled || false);
  const [paymentMethodPayPalEnabled, setPaymentMethodPayPalEnabled] = useState<boolean>(event?.paymentMethodPayPal?.enabled || false);
  const [paymentMethodPayPalHandle, setPaymentMethodPayPalHandle] = useState<string>(event?.paymentMethodPayPal?.payPalHandle || '');
  const [paymentMethodSepaEnabled, setPaymentMethodSepaEnabled] = useState<boolean>(event?.paymentMethodSepa?.enabled || false);
  const [paymentMethodSepaBank, setPaymentMethodSepaBank] = useState<string>(event?.paymentMethodSepa?.bank || '');
  const [paymentMethodSepaRecipient, setPaymentMethodSepaRecipient] = useState<string>(event?.paymentMethodSepa?.recipient || '');
  const [paymentMethodSepaIban, setPaymentMethodSepaIban] = useState<string>(event?.paymentMethodSepa?.iban || '');
  const [paymentMethodSepaReference, setPaymentMethodSepaReference] = useState<string>(event?.paymentMethodSepa?.reference || '');
  const [paymentMethodStripeEnabled, setPaymentMethodStripeEnabled] = useState<boolean>(event?.paymentMethodStripe?.enabled || false);
  const [paymentMethodStripeCoverProviderFee, setPaymentMethodStripeCoverProviderFee] = useState<boolean>(event?.paymentMethodStripe?.coverProviderFee || false);
  const [maintainers, setMaintainers] = useState<EventMaintainer[]>(event?.maintainers || []);
  const [maintainerToAddUsername, setMaintainerToAddUsername] = useState<string>();
  const [showUserCountryFlag, setShowUserCountryFlag] = useState<boolean>(event?.showUserCountryFlag || true);
  const [registrationCollectPhoneNumber, setRegistrationCollectPhoneNumber] = useState<boolean>(event?.registrationCollectPhoneNumber || false);
  const [autoApproveRegistrations, setAutoApproveRegistrations] = useState<boolean>(event?.autoApproveRegistrations || false);
  const [notifyOnRegistration, setNotifyOnRegistration] = useState<boolean>(event?.notifyOnRegistration || true);
  const [allowComments, setAllowComments] = useState<boolean>(event?.allowComments || true);
  const [notifyOnComment, setNotifyOnComment] = useState<boolean>(event?.notifyOnComment || true);
  const [waiver, setWaiver] = useState(event?.waiver || '');
  const [visaInvitationRequestsEnabled, setVisaInvitationRequestsEnabled] = useState<boolean>(event?.visaInvitationRequestsEnabled || false);
  const [imgPoster, setImgPoster] = useState<File>();
  const [imgPosterObjectURL, setImgPosterObjectURL] = useState<string>();

  const uploadToClient = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const i = e.target.files[0];
      setImgPoster(i);
      setImgPosterObjectURL(URL.createObjectURL(i));
    }
  };

  const updateEventPoster = () => {
    if (imgPoster) {
      onEventPosterUpdate(imgPoster);
    }
  };

  const handleEventTypeChanged = async (type: EventType) => {
    setEventType(type);

    if (type === EventType.MEETING) {
      setEventCategory(EventCategory.INTERNATIONAL);
      setPriceMoney(0);
    }

    if (type !== EventType.COMPETITION) {
      setIsWffaRanked(false);
    }
  };

  const handleDeleteEventPosterClicked = async () => {
    if (event?.id) {
      try {
        await deleteEventPoster(event?.id, session);
        setImgPoster(undefined);
        setImgPosterObjectURL(undefined);
        toast.info('Poster deleted');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleInputChangeAlias = (event: any) => {
    let alias: string = event.currentTarget.value;
    alias = alias.toLowerCase();

    if (validateAlias(alias)) {
      setEventAlias(alias);
    }
  };

  const checkUserInMaintainerList = (username: string): boolean => {
    return maintainers.some(maintainer => {
      if (maintainer.username === username) {
        return maintainer;
      }
    });
  };

  const addUserToMaintainerList = (username: string) => {
    try {
      const maintainer = users.filter(user => {
        if (user.username === username) {
          return user;
        }
      })[0];

      const newArray = Array.from(maintainers);
      newArray.push({ username: maintainer.username });
      setMaintainers(newArray);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleCheckBoxIsWffaRankedClicked = async () => {
    setIsWffaRanked(!isWffaRanked);

    // add wffa to maintainers list
    const username = 'wffa';
    if (!isWffaRanked === true && session?.user.username !== 'wffa') {
      if (!checkUserInMaintainerList(username)) {
        addUserToMaintainerList(username);
      }
    }
  };

  const handleAddMaintainerClicked = async (username: string) => {
    if (checkUserInMaintainerList(username)) {
      console.error(`${username} already assigned in maintainers list.`);
    } else {
      addUserToMaintainerList(username);
    }
  };

  const handleDeleteMaintainerClicked = async (maintainer: EventMaintainer) => {
    try {
      const newArray = Array.from(maintainers);
      const index = newArray.indexOf(maintainer);
      newArray.splice(index, 1);
      setMaintainers(newArray);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handlePriceMoneyChanged = (float: number) => {
    setPriceMoney(convertCurrencyDecimalToInteger(float, currency));

    if (float === 0) {
      setPriceMoney(0);
    }
  };

  const handleParticipationFeeChanged = (float: number) => {
    setParticipationFee(convertCurrencyDecimalToInteger(float, currency));

    if (float === 0) {
      setVisitorFee(0);
    }
  };

  const handleVisitorFeeChanged = (float: number) => {
    setVisitorFee(convertCurrencyDecimalToInteger(float, currency));
  };

  const handleCurrencyChanged = (newCurrency: CurrencyCode) => {
    // recalculate fees because conversion rate may have changed
    setParticipationFee(convertCurrencyDecimalToInteger(convertCurrencyIntegerToDecimal(participationFee, currency), newCurrency));
    setVisitorFee(convertCurrencyDecimalToInteger(convertCurrencyIntegerToDecimal(visitorFee, currency), newCurrency));

    setCurrency(newCurrency);
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
    const paymentMethodStripe: PaymentMethodStripe = { enabled: paymentMethodStripeEnabled, coverProviderFee: paymentMethodStripeCoverProviderFee };

    onEventUpdate({
      id: event?.id,
      licenseType: event?.licenseType || LicenseType.FREE,
      name,
      alias,
      admin: event?.admin,
      maintainers,
      type: eventType,
      description,
      dateFrom,
      dateTo,
      registrationOpen,
      registrationDeadline,
      venueName,
      venueHouseNo,
      venueStreet,
      venueCity,
      venuePostCode,
      venueCountryCode,
      category,
      isWffaRanked,
      priceMoney,
      trailerUrl,
      livestreamUrl,
      messangerInvitationUrl,
      participationFee,
      participationFeeIncPaymentCosts: -1,
      visitorFee,
      visitorFeeIncPaymentCosts: -1,
      currency,
      paymentMethodCash,
      paymentMethodPayPal,
      paymentMethodSepa,
      paymentMethodStripe,
      showUserCountryFlag,
      registrationCollectPhoneNumber,
      autoApproveRegistrations,
      notifyOnRegistration,
      allowComments,
      notifyOnComment,
      waiver,
      visaInvitationRequestsEnabled,
      accommodations: [],
      offerings: [],
      state: event?.state || EventState.CREATED,
      imageUrlPoster: event?.imageUrlPoster || '',
    });
  };

  const disableStripe = () => {
    setPaymentMethodStripeEnabled(false);
    setVisitorFee(0); // reset visitor fee, when Stripe not selected

    if (event?.licenseType === LicenseType.FREE) {
      setRegistrationCollectPhoneNumber(false);
    }
  };

  // updates inputs with given event
  useEffect(() => {
    if (editorMode === EditorMode.EDIT) {
      if (event) {
        setEventName(event.name);
        setEventAlias(event.alias);
        setMaintainers(event.maintainers);
        setDateFrom(event.dateFrom);
        setDateTo(event.dateTo);
        setParticipationFee(event.participationFee);
        setVisitorFee(event.visitorFee);
        setRegistrationOpen(event.registrationOpen);
        setRegistrationDeadline(event.registrationDeadline);
        setDescription(event.description);
        setVenueName(event.venueName);
        setVenueHouseNo(event.venueHouseNo);
        setVenueStreet(event.venueStreet);
        setVenuePostCode(event.venuePostCode);
        setVenueCity(event.venueCity);
        setVenueCountryCode(event.venueCountryCode);
        setEventType(event.type);
        setEventCategory(event.category);
        setIsWffaRanked(event.isWffaRanked);
        setPriceMoney(event.priceMoney);
        setTrailerUrl(event.trailerUrl);
        setLivestreamUrl(event.livestreamUrl);
        setMessangerInvitationUrl(event.messangerInvitationUrl);
        setPaymentMethodCashEnabled(event.paymentMethodCash.enabled);
        setPaymentMethodPayPalEnabled(event.paymentMethodPayPal.enabled);
        setPaymentMethodPayPalHandle(event.paymentMethodPayPal.payPalHandle);
        setPaymentMethodSepaEnabled(event.paymentMethodSepa.enabled);
        setPaymentMethodSepaBank(event.paymentMethodSepa.bank);
        setPaymentMethodSepaRecipient(event.paymentMethodSepa.recipient);
        setPaymentMethodSepaIban(event.paymentMethodSepa.iban);
        setPaymentMethodSepaReference(event.paymentMethodSepa.reference);
        setPaymentMethodStripeEnabled(event.paymentMethodStripe.enabled);
        setPaymentMethodStripeCoverProviderFee(event.paymentMethodStripe.coverProviderFee);
        setShowUserCountryFlag(event.showUserCountryFlag);
        setRegistrationCollectPhoneNumber(event.registrationCollectPhoneNumber);
        setAutoApproveRegistrations(event.autoApproveRegistrations);
        setNotifyOnRegistration(event.notifyOnRegistration);
        setAllowComments(event.allowComments);
        setNotifyOnComment(event.notifyOnComment);
        setWaiver(event.waiver);
        setVisaInvitationRequestsEnabled(event.visaInvitationRequestsEnabled);
      }

      if (event?.admin)
        getUser(event.admin, session).then(eventAdmin => {
          setEventAdmin(eventAdmin);
        });
    }
  }, [session]);

  useEffect(() => {
    if (editorMode === EditorMode.CREATE && session?.user.username) {
      getUser(session?.user.username, session).then(eventAdmin => {
        setEventAdmin(eventAdmin);
      });
    }
  }, [session]);

  // fires back event
  useEffect(() => {
    updateEvent();
  }, [
    name,
    alias,
    maintainers,
    dateFrom,
    dateTo,
    registrationOpen,
    registrationDeadline,
    description,
    venueName,
    venueHouseNo,
    venueStreet,
    venueCity,
    venuePostCode,
    venueCountryCode,
    eventType,
    category,
    isWffaRanked,
    priceMoney,
    trailerUrl,
    livestreamUrl,
    messangerInvitationUrl,
    participationFee,
    visitorFee,
    currency,
    paymentMethodCashEnabled,
    paymentMethodPayPalEnabled,
    paymentMethodPayPalHandle,
    paymentMethodSepaEnabled,
    paymentMethodSepaBank,
    paymentMethodSepaRecipient,
    paymentMethodSepaIban,
    paymentMethodSepaReference,
    paymentMethodStripeEnabled,
    paymentMethodStripeCoverProviderFee,
    showUserCountryFlag,
    registrationCollectPhoneNumber,
    autoApproveRegistrations,
    notifyOnRegistration,
    allowComments,
    notifyOnComment,
    waiver,
    visaInvitationRequestsEnabled,
  ]);

  // fires event poster back
  useEffect(() => {
    updateEventPoster();
  }, [imgPosterObjectURL]);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <h2 className={cn(SECTION_H2, 'pt-0.5')}>{t('sectionGeneral')}</h2>

      <TextInput id={'name'} label={t('inputName')} placeholder="German Freestyle Football Championship 2023" value={name} onChange={e => setEventName(e.currentTarget.value)} />

      <TextInput
        id={'alias'}
        label={t('inputAlias')}
        placeholder="gffc2023"
        value={alias}
        onChange={e => {
          handleInputChangeAlias(e);
        }}
      />

      <FieldRow label={t('cbType')}>
        {editorMode === EditorMode.CREATE ? (
          <ComboBox
            menus={menuEventTypes}
            value={eventType}
            onChange={(value: EventType) => {
              handleEventTypeChanged(value);
            }}
          />
        ) : (
          <div className={READONLY_VALUE_CLASS}>{menuEventTypes.find(item => item.value === eventType)?.text}</div>
        )}
      </FieldRow>

      {eventType !== EventType.MEETING && (
        <FieldRow label={t('cbCategory')}>
          <ComboBox
            menus={menuEventCategories(eventAdmin?.isWffaMember || false)}
            value={category}
            onChange={(value: EventCategory) => {
              setEventCategory(value);
            }}
          />
        </FieldRow>
      )}

      {eventType === EventType.COMPETITION && (
        <CheckBox
          id={'isWffaRanked'}
          label={t('chbIsWffaRanked')}
          value={isWffaRanked}
          disabled={!isEventAdmin(event, session)}
          onChange={() => {
            handleCheckBoxIsWffaRankedClicked();
          }}
        />
      )}

      {event?.state && (
        <FieldRow label={t('lblState')}>
          <Link href={`${routeEvents}/${event.id}?state=1`} className="min-w-0">
            <span id={'eventState'} className={cn(READONLY_VALUE_CLASS, 'hover:underline')}>
              {(event?.state.charAt(0).toUpperCase() + event?.state.slice(1)).replaceAll('_', ' ')}
            </span>
          </Link>
        </FieldRow>
      )}

      <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={imgPosterObjectURL ? imgPosterObjectURL : event?.imageUrlPoster ? event.imageUrlPoster : imgImagePlaceholder}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg border border-border/60 object-cover"
          />
          {event?.imageUrlPoster && (
            <ActionButton
              action={Action.DELETE}
              onClick={() => {
                handleDeleteEventPosterClicked();
              }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input type="file" accept="image/*" className={FILE_INPUT_CLASS} onChange={uploadToClient} />
        </div>
      </div>

      <TextInputLarge
        id={'description'}
        label={t('inputDescription')}
        placeholder="German Championship"
        value={description}
        resizable={true}
        onChange={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <FieldRow label={t('datePickerFrom')}>
        <div className={FIELD_CONTROL_TALL_INNER}>
          <DatePicker
            date={moment(dateFrom)}
            fromDate={moment('2020')}
            toDate={moment().add(2, 'y')}
            onChange={value => {
              if (value) {
                setDateFrom(value.startOf('day').utc().format());
                setDateTo(value.endOf('day').utc().format());
              }
            }}
          />
        </div>
      </FieldRow>

      <FieldRow label={t('datePickerTo')}>
        <div className={FIELD_CONTROL_TALL_INNER}>
          <DatePicker
            date={moment(dateTo)}
            fromDate={moment('2020')}
            toDate={moment().add(2, 'y')}
            onChange={value => {
              if (value) {
                setDateTo(value.endOf('day').utc().format());
              }
            }}
          />
        </div>
      </FieldRow>

      <FieldRow label={t('datePickerRegistrationFrom')}>
        <div className={FIELD_CONTROL_TALL_INNER}>
          <DatePicker
            date={moment(registrationOpen)}
            fromDate={moment('2020')}
            toDate={moment().add(2, 'y')}
            onChange={value => {
              if (value) {
                setRegistrationOpen(value.startOf('day').utc().format());
              }
            }}
          />
        </div>
      </FieldRow>

      <FieldRow label={t('datePickerRegistrationTo')}>
        <div className={FIELD_CONTROL_TALL_INNER}>
          <DatePicker
            date={moment(registrationDeadline)}
            fromDate={moment('2020')}
            toDate={moment().add(2, 'y')}
            onChange={value => {
              if (value) {
                setRegistrationDeadline(value.endOf('day').utc().format());
              }
            }}
          />
        </div>
      </FieldRow>

      <CurInput
        id={'priceMoney'}
        label={t('inputPriceMoney')}
        placeholder="2500"
        value={convertCurrencyIntegerToDecimal(priceMoney, currency)}
        onValueChange={(value, name, values) => {
          if (values?.float || values?.float === 0) {
            handlePriceMoneyChanged(values.float);
          }
        }}
      />

      <TextInput
        id={'trailerUrl'}
        label={t('inputTrailerUrl')}
        placeholder="https://www.youtube.com/watch?v=JsPpmzMODQQ"
        value={trailerUrl || ''}
        onChange={e => {
          setTrailerUrl(e.currentTarget.value || null);
        }}
      />

      <TextInput
        id={'livestreamUrl'}
        label={t('inputLivestreamUrl')}
        placeholder="https://www.youtube.com/watch?v=gwiE0fXnByg"
        value={livestreamUrl || ''}
        onChange={e => {
          setLivestreamUrl(e.currentTarget.value || null);
        }}
      />

      <TextInput
        id={'messangerInvitationUrl'}
        label={t('inputMessangerInvitationUrl')}
        placeholder="https://chat.whatsapp.com/FcFFSq0ybgT4tsk48ZQoxJ"
        value={messangerInvitationUrl || ''}
        onChange={e => {
          setMessangerInvitationUrl(e.currentTarget.value || null);
        }}
      />

      {eventType != EventType.COMPETITION_ONLINE && (
        <>
          <div className="py-1">
            <Separator />
          </div>
          <h2 className={SECTION_H2}>{t('sectionLocation')}</h2>

          <TextInput
            id={'venueName'}
            label={t('inputVenueName')}
            placeholder="TSG 1845 Heilbronn"
            value={venueName}
            onChange={e => {
              setVenueName(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venueStreet'}
            label={t('inputVenueStreet')}
            placeholder="Hofwiesenstraße"
            value={venueStreet}
            onChange={e => {
              setVenueStreet(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venueHouseNo'}
            label={t('inputVenueHouseNumber')}
            placeholder="40/1"
            value={venueHouseNo}
            onChange={e => {
              setVenueHouseNo(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venuePostCode'}
            label={t('inputVenuePostCode')}
            placeholder="74081"
            value={venuePostCode}
            onChange={e => {
              setVenuePostCode(e.currentTarget.value);
            }}
          />

          <TextInput
            id={'venueCity'}
            label={t('inputVenueCity')}
            placeholder="Heilbronn"
            value={venueCity}
            onChange={e => {
              setVenueCity(e.currentTarget.value);
            }}
          />

          <FieldRow label={t('cbVenueCountry')}>
            <ComboBox
              menus={menuCountriesWithUnspecified}
              value={venueCountryCode || menuCountriesWithUnspecified[0].value}
              searchEnabled={true}
              onChange={(value: any) => {
                setVenueCountryCode(value);
              }}
            />
          </FieldRow>
        </>
      )}

      <div className="py-1">
        <Separator />
      </div>
      <h2 className={SECTION_H2}>{t('sectionPayment')}</h2>

      <FieldRow label={t('cbPaymentCurrency')}>
        <ComboBox
          menus={menuCurrencies}
          value={currency}
          onChange={(value: any) => {
            handleCurrencyChanged(value);
          }}
        />
      </FieldRow>

      <CurInput
        id={'participationFee'}
        label={t('inputPaticipantFee')}
        placeholder="25,00"
        value={convertCurrencyIntegerToDecimal(participationFee, currency)}
        onValueChange={(value, name, values) => {
          if (values?.float || values?.float === 0) {
            handleParticipationFeeChanged(values.float);
          }
        }}
      />

      {participationFee > 0 && (
        <>
          {paymentMethodStripeEnabled && (
            <CurInput
              id={'visitorFee'}
              label={t('inputVisitorFee')}
              placeholder="10,00"
              value={convertCurrencyIntegerToDecimal(visitorFee, currency)}
              onValueChange={(value, name, values) => {
                if (values?.float || values?.float === 0) {
                  handleVisitorFeeChanged(values.float);
                }
              }}
            />
          )}

          <p className="min-w-0 text-sm font-medium text-foreground/90">{`${t('lblFreeMethods')}:`}</p>

          <CheckBox
            id={'paymentMethodCashEnabled'}
            label={`- ${t('chbCashAccept')}`}
            value={paymentMethodCashEnabled}
            onChange={() => {
              setPaymentMethodCashEnabled(!paymentMethodCashEnabled);

              if (!paymentMethodCashEnabled === true) {
                disableStripe();
              }
            }}
          />

          <CheckBox
            id={'paymentMethodPayPalEnabled'}
            label={`- ${t('chbPayPalAccept')}`}
            value={paymentMethodPayPalEnabled}
            onChange={() => {
              setPaymentMethodPayPalEnabled(!paymentMethodPayPalEnabled);

              if (!paymentMethodPayPalEnabled === true) {
                disableStripe();
              }
            }}
          />

          {paymentMethodPayPalEnabled && (
            <>
              <TextInput
                id={'paymentMethodPayPal'}
                label={t('inputPayPalUsername')}
                placeholder="username"
                value={paymentMethodPayPalHandle}
                onChange={e => {
                  setPaymentMethodPayPalHandle(e.currentTarget.value);
                }}
              />

              {paymentMethodPayPalHandle && (
                <FieldRow label={t('lnkPayPalVerifyAccount')}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://paypal.me/${paymentMethodPayPalHandle}`}
                    className={cn(READONLY_VALUE_CLASS, 'min-w-0 break-all hover:underline')}
                  >{`https://paypal.me/${paymentMethodPayPalHandle}`}</a>
                </FieldRow>
              )}
            </>
          )}

          <CheckBox
            id={'paymentMethodSepaEnabled'}
            label={`- ${t('chbBankSepaAccept')}`}
            value={paymentMethodSepaEnabled}
            onChange={() => {
              setPaymentMethodSepaEnabled(!paymentMethodSepaEnabled);

              if (!paymentMethodSepaEnabled === true) {
                disableStripe();
              }
            }}
          />

          {paymentMethodSepaEnabled && (
            <>
              <TextInput
                id={'paymentMethodSepaBank'}
                label={t('inputBankSepaBank')}
                placeholder="DKB"
                value={paymentMethodSepaBank}
                onChange={e => {
                  setPaymentMethodSepaBank(e.currentTarget.value);
                }}
              />

              <TextInput
                id={'paymentMethodSepaRecipient'}
                label={t('inputBankSepaRecipeint')}
                placeholder="DFFB e.V."
                value={paymentMethodSepaRecipient}
                onChange={e => {
                  setPaymentMethodSepaRecipient(e.currentTarget.value);
                }}
              />

              <TextInput
                id={'paymentMethodSepaIban'}
                label={t('inputBankSepaIban')}
                placeholder="DE01 2345 0000 6789 8765 43"
                value={paymentMethodSepaIban}
                onChange={e => {
                  setPaymentMethodSepaIban(e.currentTarget.value);
                }}
              />

              <TextInput
                id={'paymentMethodSepaReference'}
                label={t('inputBankSepaReference')}
                placeholder="superball-2023"
                value={paymentMethodSepaReference}
                onChange={e => {
                  setPaymentMethodSepaReference(e.currentTarget.value);
                }}
              />
            </>
          )}

          <p className="min-w-0 text-sm font-medium text-foreground/90">{`${t('lblProfessionalMethods')}:`}</p>

          {!eventAdmin?.stripeAccountId && (
            <FieldRow label={t('textCreateStripeAccount')}>
              <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'w-full sm:w-auto sm:justify-self-end')}>
                <Link href={`${routeAccount}/?tab=account`} target="_blank">
                  {t(`btnCreateStripeAccount`)}
                </Link>
              </Button>
            </FieldRow>
          )}

          <CheckBox
            id={'paymentMethodStripeEnabled'}
            label={`- ${t('chbStripeAccept')}`}
            value={paymentMethodStripeEnabled}
            disabled={!eventAdmin?.stripeAccountId}
            onChange={() => {
              setPaymentMethodStripeEnabled(!paymentMethodStripeEnabled);

              if (!paymentMethodStripeEnabled === true) {
                setPaymentMethodCashEnabled(false);
                setPaymentMethodPayPalEnabled(false);
                setPaymentMethodSepaEnabled(false);
              } else {
                disableStripe();
              }
            }}
          />

          {paymentMethodStripeEnabled && (
            <CheckBox
              id={'paymentMethodStripeCoverProviderFeeEnabled'}
              label={`${t('chbStripeCoverProviderFee')}`}
              value={paymentMethodStripeCoverProviderFee}
              onChange={() => {
                setPaymentMethodStripeCoverProviderFee(!paymentMethodStripeCoverProviderFee);
              }}
            />
          )}
        </>
      )}

      {/* only allow event admin to edit maintainers */}
      {(editorMode === EditorMode.CREATE || isEventAdmin(event, session)) && (
        <>
          <div className="py-1">
            <Separator />
          </div>
          <h2 className={SECTION_H2}>{t('sectionMaintainers')}</h2>
          <p className="min-w-0 text-sm text-foreground/90">{t('cbMaintainers')}</p>
          <div className="flex min-w-0 flex-col gap-3">
            {users.length > 0 &&
              maintainers.map((maintainer, index) => (
                <div key={`maintainer-${maintainer.username}-${index}`} className="flex min-w-0 items-center justify-between gap-2 py-0.5">
                  <div className="min-w-0 flex-1">
                    <UserCard
                      user={
                        users.filter(user => {
                          return user.username === maintainer.username;
                        })[0]
                      }
                      showUserCountryFlag={showUserCountryFlag}
                    />
                  </div>
                  <ActionButton
                    action={Action.DELETE}
                    onClick={() => {
                      handleDeleteMaintainerClicked(maintainer);
                    }}
                  />
                </div>
              ))}

            <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:gap-2">
              <div className="min-w-0 w-full flex-1">
                <ComboBox
                  menus={users.map(user => {
                    const displayName = user.lastName ? `${user.firstName} ${user.lastName} (${user.username})` : `${user.firstName} (${user.username})`;
                    return { text: displayName, value: user.username };
                  })}
                  value={maintainerToAddUsername || ''}
                  searchEnabled={true}
                  onChange={(value: string) => {
                    setMaintainerToAddUsername(value);
                  }}
                />
              </div>
              <div className="flex shrink-0 justify-end sm:pb-0.5">
                <ActionButton
                  action={Action.ADD}
                  onClick={() => {
                    if (maintainerToAddUsername) {
                      handleAddMaintainerClicked(maintainerToAddUsername);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="py-1">
        <Separator />
      </div>
      <h2 className={SECTION_H2}>{t('sectionOther')}</h2>

      <CheckBox
        id={'showUserCountryFlag'}
        label={t('chbShowUserCountryFlag')}
        value={showUserCountryFlag}
        onChange={() => {
          setShowUserCountryFlag(!showUserCountryFlag);
        }}
      />

      {(event?.licenseType === LicenseType.PRO || paymentMethodStripeEnabled) && (
        <CheckBox
          id={'registrationCollectPhoneNumber'}
          label={t('chbRegistrationCollectPhoneNumber')}
          value={registrationCollectPhoneNumber}
          disabled={eventAdmin?.verificationState !== UserVerificationState.VERIFIED}
          onChange={() => {
            setRegistrationCollectPhoneNumber(!registrationCollectPhoneNumber);
          }}
        />
      )}

      {!paymentMethodStripeEnabled && (
        <CheckBox
          id={'autoApproveRegistrations'}
          label={t('chbAutoApproveRegistration')}
          value={autoApproveRegistrations}
          onChange={() => {
            setAutoApproveRegistrations(!autoApproveRegistrations);
          }}
        />
      )}

      <CheckBox
        id={'notifyOnRegistration'}
        label={t('chbNotifyOnRegistration')}
        value={notifyOnRegistration}
        onChange={() => {
          setNotifyOnRegistration(!notifyOnRegistration);
        }}
      />
      <CheckBox
        id={'allowComments'}
        label={t('chbAllowCommentsAndQuestions')}
        value={allowComments}
        onChange={() => {
          setAllowComments(!allowComments);
        }}
      />
      {allowComments && (
        <CheckBox
          id={'notifyOnComment'}
          label={t('chbNotifyOnComment')}
          value={notifyOnComment}
          onChange={() => {
            setNotifyOnComment(!notifyOnComment);
          }}
        />
      )}

      {/* TODO: for now only wffa is eligible to activate */}
      {/* commented because it's only available for superball atm. activate manually. */}
      {/* {paymentMethodStripeEnabled && event?.admin === 'wffa' && (
        <CheckBox
          id={'visaInvitationRequestsEnabled'}
          label={t('chbVisaInvitationRequestsEnabled')}
          value={visaInvitationRequestsEnabled}
          onChange={() => {
            setVisaInvitationRequestsEnabled(!visaInvitationRequestsEnabled);
          }}
        />
      )} */}

      <TextInputLarge
        id={'waiver'}
        label={t('inputWaiver')}
        placeholder="By participating in this event, I acknowledge ..."
        value={waiver}
        resizable={true}
        onChange={e => {
          setWaiver(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default EventEditor;
