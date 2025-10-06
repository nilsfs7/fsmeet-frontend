'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import moment from 'moment';
import { Event } from '@/domain/types/event';
import { EventType } from '@/domain/enums/event-type';
import CheckBox from '../common/CheckBox';
import TextInputLarge from '../common/TextInputLarge';
import { PaymentMethodCash } from '@/domain/types/payment-method-cash';
import { PaymentMethodPayPal } from '@/domain/types/payment-method-paypal';
import { PaymentMethodSepa } from '@/domain/types/payment-method-sepa';
import ComboBox from '../common/ComboBox';
import { menuEventTypes } from '@/domain/constants/menus/menu-event-types';
import { validateAlias } from '@/functions/validation/validation-event';
import CurInput from '../common/CurrencyInput';
import { EventState } from '@/domain/enums/event-state';
import { DatePicker } from '../common/DatePicker';
import { EditorMode } from '@/domain/enums/editor-mode';
import Separator from '../Seperator';
import SectionHeader from '../common/SectionHeader';
import Link from 'next/link';
import { routeAccount, routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import { EventMaintainer } from '@/domain/types/event-maintainer';
import UserCard from '../user/user-card';
import ActionButton from '../common/ActionButton';
import { Action } from '@/domain/enums/action';
import { User } from '@/domain/types/user';
import { getUser } from '@/infrastructure/clients/user.client';
import { isEventAdmin } from '@/functions/is-event-admin';
import { useSession } from 'next-auth/react';
import { PaymentMethodStripe } from '@/domain/types/payment-method-stripe';
import TextButton from '../common/TextButton';
import { menuCountriesWithUnspecified } from '@/domain/constants/menus/menu-countries';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { deleteEventPoster } from '@/infrastructure/clients/event.client';
import { Toaster, toast } from 'sonner';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { menuCurrencies } from '@/domain/constants/menus/menu-currencies';
import { EventCategory } from '@/domain/enums/event-category';
import { menuEventCategories } from '@/domain/constants/menus/menu-event-categories';
import { UserVerificationState } from '../../domain/enums/user-verification-state';

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
  const [venueCountry, setVenueCountry] = useState(event?.venueCountry || '');
  const [eventType, setEventType] = useState<EventType>(event?.type || EventType.COMPETITION);
  const [category, setEventCategory] = useState<EventCategory>(event?.category || EventCategory.NATIONAL);
  const [isWffaRanked, setIsWffaRanked] = useState(event?.isWffaRanked || false);
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

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

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
      venueCountry,
      category,
      isWffaRanked,
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

  // updates inputs with given event
  useEffect(() => {
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
      setVenueCountry(event.venueCountry);
      setEventType(event.type);
      setEventCategory(event.category);
      setIsWffaRanked(event.isWffaRanked);
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
  }, [editorMode === EditorMode.EDIT]);

  useEffect(() => {
    if (session?.user.username)
      getUser(session?.user.username, session).then(eventAdmin => {
        setEventAdmin(eventAdmin);
      });
  }, [editorMode === EditorMode.CREATE]);

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
    venueCountry,
    eventType,
    category,
    isWffaRanked,
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
    // <>
    //   <Toaster richColors />

    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1 overflow-y-auto">
      <SectionHeader label={t('sectionGeneral')} />

      <TextInput
        id={'name'}
        label={t('inputName')}
        placeholder="German Freestyle Football Championship 2023"
        value={name}
        onChange={e => {
          setEventName(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'alias'}
        label={t('inputAlias')}
        placeholder="gffc2023"
        value={alias}
        onChange={e => {
          handleInputChangeAlias(e);
        }}
      />

      <div className="m-2 grid grid-cols-2 items-center gap-2">
        <div>{t('cbType')}</div>
        <div className="flex w-full">
          {editorMode === EditorMode.CREATE && (
            <ComboBox
              menus={menuEventTypes}
              value={eventType}
              onChange={(value: EventType) => {
                handleEventTypeChanged(value);
              }}
            />
          )}

          {editorMode === EditorMode.EDIT && <div>{menuEventTypes.find(item => item.value === eventType)?.text}</div>}
        </div>
      </div>

      {eventType !== EventType.MEETING && (
        <div className="m-2 grid grid-cols-2 items-center gap-2">
          <div>{t('cbCategory')}</div>
          <div className="flex w-full">
            <ComboBox
              menus={menuEventCategories}
              value={category}
              onChange={(value: EventCategory) => {
                setEventCategory(value);
              }}
            />
          </div>
        </div>
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
        <div className="m-2 grid grid-cols-2 items-center gap-2">
          <div>{t('lblState')}</div>
          <Link href={`${routeEvents}/${event.id}?state=1`}>
            <label id={'eventState'} className="w-full hover:underline">
              {(event?.state.charAt(0).toUpperCase() + event?.state.slice(1)).replaceAll('_', ' ')}
            </label>
          </Link>
        </div>
      )}

      <div className="flex m-2 gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={imgPosterObjectURL ? imgPosterObjectURL : event?.imageUrlPoster ? event.imageUrlPoster : imgImagePlaceholder} className="flex h-12 w-12 object-cover border border-primary" />

          {event?.imageUrlPoster && (
            <ActionButton
              action={Action.DELETE}
              onClick={() => {
                handleDeleteEventPosterClicked();
              }}
            />
          )}
        </div>

        <input type="file" onChange={uploadToClient} />
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

      <div className="m-2 grid grid-cols-2 items-center gap-2">
        <div>{t('datePickerFrom')}</div>
        <DatePicker
          date={moment(dateFrom)}
          fromDate={moment('2020')}
          toDate={moment().add(2, 'y')}
          onChange={value => {
            if (value) {
              setDateFrom(value.startOf('day').utc().format());
              setDateTo(value.endOf('day').utc().format()); // set dateTo to same date when dateFrom from was changed (convenience)
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2 items-center gap-2">
        <div>{t('datePickerTo')}</div>
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

      <div className="m-2 grid grid-cols-2 items-center gap-2">
        <div>{t('datePickerRegistrationFrom')}</div>
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

      <div className="m-2 grid grid-cols-2 items-center gap-2">
        <div>{t('datePickerRegistrationTo')}</div>
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

      <TextInput
        id={'trailerUrl'}
        label={t('inputTrailerUrl')}
        placeholder="https://www.youtube.com/watch?v=JsPpmzMODQQ"
        value={trailerUrl || undefined}
        onChange={e => {
          setTrailerUrl(e.currentTarget.value || null);
        }}
      />

      <TextInput
        id={'livestreamUrl'}
        label={t('inputLivestreamUrl')}
        placeholder="https://www.youtube.com/watch?v=gwiE0fXnByg"
        value={livestreamUrl || undefined}
        onChange={e => {
          setLivestreamUrl(e.currentTarget.value || null);
        }}
      />

      <TextInput
        id={'messangerInvitationUrl'}
        label={t('inputMessangerInvitationUrl')}
        placeholder="https://chat.whatsapp.com/FcFFSq0ybgT4tsk48ZQoxJ"
        value={messangerInvitationUrl || undefined}
        onChange={e => {
          setMessangerInvitationUrl(e.currentTarget.value || null);
        }}
      />

      {eventType != EventType.COMPETITION_ONLINE && (
        <>
          <div className="m-2">
            <Separator />
          </div>
          <SectionHeader label={t('sectionLocation')} />

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
            id={'venueHouseNo'}
            label={t('inputVenueHouseNumber')}
            placeholder="40/1"
            value={venueHouseNo}
            onChange={e => {
              setVenueHouseNo(e.currentTarget.value);
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

          <div className="m-2 grid grid-cols-2 items-center">
            <div>{t('cbVenueCountry')}</div>
            <div className="flex w-full">
              <ComboBox
                menus={menuCountriesWithUnspecified}
                value={venueCountry || menuCountriesWithUnspecified[0].value}
                searchEnabled={true}
                onChange={(value: any) => {
                  setVenueCountry(value);
                }}
              />
            </div>
          </div>
        </>
      )}

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={t('sectionPayment')} />

      <div className="m-2 grid grid-cols-2 items-center">
        <div>{t('cbPaymentCurrency')}</div>
        <div className="flex w-full">
          <ComboBox
            menus={menuCurrencies}
            value={currency}
            onChange={(value: any) => {
              handleCurrencyChanged(value);
            }}
          />
        </div>
      </div>

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

          <div className="m-2">{`${t('lblFreeMethods')}:`}</div>

          <CheckBox
            id={'paymentMethodCashEnabled'}
            label={`- ${t('chbCashAccept')}`}
            value={paymentMethodCashEnabled}
            onChange={() => {
              setPaymentMethodCashEnabled(!paymentMethodCashEnabled);

              if (!paymentMethodCashEnabled === true) {
                setPaymentMethodStripeEnabled(false);
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
                setPaymentMethodStripeEnabled(false);
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
                <div className="m-2 grid h-[100%] grid-cols-2">
                  <div>{t('lnkPayPalVerifyAccount')}</div>

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
            label={`- ${t('chbBankSepaAccept')}`}
            value={paymentMethodSepaEnabled}
            onChange={() => {
              setPaymentMethodSepaEnabled(!paymentMethodSepaEnabled);

              if (!paymentMethodSepaEnabled === true) {
                setPaymentMethodStripeEnabled(false);
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

          <div className="m-2">{`${t('lblProfessionalMethods')}:`}</div>

          {!eventAdmin?.stripeAccountId && (
            <div className="grid grid-cols-2 m-2">
              <div className="flex items-center">{t(`textCreateStripeAccount`)}</div>
              <Link href={`${routeAccount}/?tab=account`} target="_blank">
                <TextButton text={t(`btnCreateStripeAccount`)} />
              </Link>
            </div>
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
                setVisitorFee(0); // reset visitor fee, when Stripe not selected
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
          <div className="m-2">
            <Separator />
          </div>
          <SectionHeader label={t('sectionMaintainers')} />

          <div className="flex h-[100%] flex-col p-2">
            <div>{t('cbMaintainers')}</div>

            <div className="flex h-full">
              <div className="flex flex-col w-full gap-2">
                {users.length > 0 &&
                  maintainers.map((maintainer, index) => {
                    return (
                      <div key={`${maintainer}-${index}`} className="flex justify-between gap-2">
                        <UserCard
                          user={
                            users.filter(user => {
                              return user.username === maintainer.username;
                            })[0]
                          }
                          showUserCountryFlag={showUserCountryFlag}
                        />
                        <ActionButton
                          action={Action.DELETE}
                          onClick={() => {
                            handleDeleteMaintainerClicked(maintainer);
                          }}
                        />
                      </div>
                    );
                  })}

                <div className="flex justify-between gap-2">
                  <ComboBox
                    menus={users.map(user => {
                      return { text: `${user.firstName} (${user.username})`, value: user.username };
                    })}
                    value={maintainerToAddUsername || ''}
                    searchEnabled={true}
                    onChange={(value: string) => {
                      setMaintainerToAddUsername(value);
                    }}
                  />

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
          </div>
        </>
      )}

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={t('sectionOther')} />

      <CheckBox
        id={'showUserCountryFlag'}
        label={t('chbShowUserCountryFlag')}
        value={showUserCountryFlag}
        onChange={() => {
          setShowUserCountryFlag(!showUserCountryFlag);
        }}
      />

      {paymentMethodStripeEnabled && (
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

      {paymentMethodStripeEnabled && (
        <>
          {/* TODO: if user is eligible to set this */}
          <CheckBox
            id={'visaInvitationRequestsEnabled'}
            label={t('chbVisaInvitationRequestsEnabled')}
            value={visaInvitationRequestsEnabled}
            onChange={() => {
              setVisaInvitationRequestsEnabled(!visaInvitationRequestsEnabled);
            }}
          />

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
        </>
      )}
    </div>
    // </>
  );
};

export default EventEditor;
