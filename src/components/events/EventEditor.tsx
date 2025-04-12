'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import moment from 'moment';
import { Event } from '@/types/event';
import { EventType } from '@/domain/enums/event-type';
import CheckBox from '../common/CheckBox';
import TextInputLarge from '../common/TextInputLarge';
import { PaymentMethodCash } from '@/types/payment-method-cash';
import { PaymentMethodPayPal } from '@/types/payment-method-paypal';
import { PaymentMethodSepa } from '@/types/payment-method-sepa';
import ComboBox from '../common/ComboBox';
import { menuEventTypes } from '@/domain/constants/menus/menu-event-types';
import { validateAlias } from '@/functions/validation/validation-event';
import CurInput from '../common/CurrencyInput';
import { EventState } from '@/domain/enums/event-state';
import { DatePicker } from '../common/DatePicker';
import { EditorMode } from '@/domain/enums/editor-mode';
import Separator from '../Seperator';
import SectionHeader from '../common/section-header';
import Link from 'next/link';
import { routeAccount, routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import { EventMaintainer } from '@/types/event-maintainer';
import UserCard from '../user/UserCard';
import ActionButton from '../common/ActionButton';
import { Action } from '@/domain/enums/action';
import { User } from '@/types/user';
import { getUser, getUsers } from '@/infrastructure/clients/user.client';
import { UserType } from '@/domain/enums/user-type';
import { isEventAdmin } from '@/functions/isEventAdmin';
import { useSession } from 'next-auth/react';
import { PaymentMethodStripe } from '@/types/payment-method-stripe';
import TextButton from '../common/TextButton';
import { menuCountriesWithUnspecified } from '@/domain/constants/menus/menu-countries';

interface IEventEditorProps {
  editorMode: EditorMode;
  event?: Event;
  onEventUpdate: (event: Event) => void;
}

const EventEditor = ({ editorMode, event, onEventUpdate }: IEventEditorProps) => {
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
  const [trailerUrl, setTrailerUrl] = useState(event?.trailerUrl || '');
  const [livestreamUrl, setLivestreamUrl] = useState(event?.livestreamUrl || '');
  const [messangerInvitationUrl, setMessangerInvitationUrl] = useState(event?.messangerInvitationUrl || '');
  const [participationFee, setParticipationFee] = useState(event?.participationFee || 0.0);
  const [visitorFee, setVisitorFee] = useState(event?.visitorFee || 0.0);
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
  const [users, setUsers] = useState<User[]>([]);
  const [autoApproveRegistrations, setAutoApproveRegistrations] = useState<boolean>(event?.autoApproveRegistrations || false);
  const [notifyOnRegistration, setNotifyOnRegistration] = useState<boolean>(event?.notifyOnRegistration || true);
  const [allowComments, setAllowComments] = useState<boolean>(event?.allowComments || true);
  const [notifyOnComment, setNotifyOnComment] = useState<boolean>(event?.notifyOnComment || true);

  const handleInputChangeAlias = (event: any) => {
    let alias: string = event.currentTarget.value;
    alias = alias.toLowerCase();

    if (validateAlias(alias)) {
      setEventAlias(alias);
    }
  };

  const handleAddMaintainerClicked = async (username: string) => {
    // check if maintainer is already in array
    const maintainersMatching = maintainers.filter(maintainer => {
      if (maintainer.username === username) {
        return maintainer;
      }
    });

    if (maintainersMatching.length > 0) {
      console.error(`${username} already assigned in maintainers list.`);
    } else {
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
      name: name,
      alias: alias,
      admin: event?.admin,
      maintainers: maintainers,
      type: eventType,
      description: description,
      dateFrom: dateFrom,
      dateTo: dateTo,
      registrationOpen: registrationOpen,
      registrationDeadline: registrationDeadline,
      venueName: venueName,
      venueHouseNo: venueHouseNo,
      venueStreet: venueStreet,
      venueCity: venueCity,
      venuePostCode: venuePostCode,
      venueCountry: venueCountry,
      trailerUrl: trailerUrl,
      livestreamUrl: livestreamUrl,
      messangerInvitationUrl: messangerInvitationUrl,
      participationFee: participationFee,
      participationFeeIncPaymentCosts: -1,
      visitorFee: visitorFee,
      visitorFeeIncPaymentCosts: -1,
      paymentMethodCash: paymentMethodCash,
      paymentMethodPayPal: paymentMethodPayPal,
      paymentMethodSepa: paymentMethodSepa,
      paymentMethodStripe: paymentMethodStripe,
      autoApproveRegistrations: autoApproveRegistrations,
      notifyOnRegistration: notifyOnRegistration,
      allowComments: allowComments,
      notifyOnComment: notifyOnComment,
      eventRegistrations: [],
      competitions: [],
      accommodations: [],
      offerings: [],
      state: event?.state || EventState.CREATED,
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
      setAutoApproveRegistrations(event.autoApproveRegistrations);
      setNotifyOnRegistration(event.notifyOnRegistration);
      setAllowComments(event.allowComments);
      setNotifyOnComment(event.notifyOnComment);
    }

    if (event?.admin)
      getUser(event.admin, session).then(eventAdmin => {
        setEventAdmin(eventAdmin);
      });

    getUsers().then(users => {
      users = users.filter(user => {
        if (user.type !== UserType.TECHNICAL) return user;
      });
      setUsers(users);
    });
  }, [event]);

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
    trailerUrl,
    livestreamUrl,
    messangerInvitationUrl,
    participationFee,
    visitorFee,
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
    autoApproveRegistrations,
    notifyOnRegistration,
    allowComments,
    notifyOnComment,
  ]);

  return (
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

      <div className="m-2 grid grid-cols-2">
        <div>{t('cbType')}</div>
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
          {editorMode === EditorMode.EDIT && <div>{menuEventTypes.find(item => item.value === eventType)?.text}</div>}
        </div>
      </div>

      {event?.state && (
        <div className="m-2 grid grid-cols-2 items-center">
          <div>{t('lblState')}</div>
          <Link href={`${routeEvents}/${event.id}?state=1`}>
            <label id={'eventState'} className="w-full hover:underline">
              {(event?.state.charAt(0).toUpperCase() + event?.state.slice(1)).replaceAll('_', ' ')}
            </label>
          </Link>
        </div>
      )}

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

      <div className="m-2 grid grid-cols-2">
        <div>{t('datePickerFrom')}</div>
        <DatePicker
          date={moment(dateFrom)}
          fromDate={moment(2020)}
          toDate={moment().add(2, 'y')}
          onChange={value => {
            if (value) {
              setDateFrom(value.startOf('day').utc().format());
              setDateTo(value.endOf('day').utc().format()); // set dateTo to same date when dateFrom from was changed (convenience)
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{t('datePickerTo')}</div>
        <DatePicker
          date={moment(dateTo)}
          fromDate={moment(2020)}
          toDate={moment().add(2, 'y')}
          onChange={value => {
            if (value) {
              setDateTo(value.endOf('day').utc().format());
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{t('datePickerRegistrationFrom')}</div>
        <DatePicker
          date={moment(registrationOpen)}
          fromDate={moment(2020)}
          toDate={moment().add(2, 'y')}
          onChange={value => {
            if (value) {
              setRegistrationOpen(value.startOf('day').utc().format());
            }
          }}
        />
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{t('datePickerRegistrationTo')}</div>
        <DatePicker
          date={moment(registrationDeadline)}
          fromDate={moment(2020)}
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
        value={trailerUrl}
        onChange={e => {
          setTrailerUrl(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'livestreamUrl'}
        label={t('inputLivestreamUrl')}
        placeholder="https://www.youtube.com/watch?v=gwiE0fXnByg"
        value={livestreamUrl}
        onChange={e => {
          setLivestreamUrl(e.currentTarget.value);
        }}
      />

      <TextInput
        id={'messangerInvitationUrl'}
        label={t('inputMessangerInvitationUrl')}
        placeholder="https://chat.whatsapp.com/FcFFSq0ybgT4tsk48ZQoxJ"
        value={messangerInvitationUrl}
        onChange={e => {
          setMessangerInvitationUrl(e.currentTarget.value);
        }}
      />

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={t('sectionLocation')} />

      {eventType != EventType.COMPETITION_ONLINE && (
        <>
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

      <CurInput
        id={'participationFee'}
        label={t('inputPaticipantFee')}
        placeholder="25,00"
        value={participationFee}
        onValueChange={(value, name, values) => {
          if (values?.float || values?.float === 0) {
            setParticipationFee(values?.float);

            if (values?.float === 0) {
              setVisitorFee(0);
            }
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
              value={visitorFee}
              onValueChange={(value, name, values) => {
                if (values?.float || values?.float === 0) {
                  setVisitorFee(values?.float);
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
      {isEventAdmin(event, session) && (
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
        id={'autoApproveRegistrations'}
        label={t('chbAutoApproveRegistration')}
        value={autoApproveRegistrations}
        onChange={() => {
          setAutoApproveRegistrations(!autoApproveRegistrations);
        }}
      />
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
    </div>
  );
};

export default EventEditor;
