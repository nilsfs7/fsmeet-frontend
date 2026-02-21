'use client';

import { useState } from 'react';
import TextButton from '@/components/common/text-button';
import TextInputLarge from '@/components/common/text-input-large';
import { routeAdminOverview } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/page-title';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { createBroadcast } from '../../../infrastructure/clients/notification.client';
import TextInput from '../../../components/common/text-input';
import { NotificationAction } from '../../../domain/enums/notification-action';
import ComboBox from '../../../components/common/combo-box';
import { menuNotificationActions } from '../../../domain/constants/menus/menu-notification-action';
import CheckBox from '../../../components/common/check-box';

const defaultValArbitraryData: Record<string, string> = { isAnnouncement: 'true' };

export default function Broadcast() {
  const { data: session } = useSession();

  const arbDataItems = ['eventId', 'username'];

  const [title, setTitle] = useState<string>('Admin Announcement');
  const [message, setMessage] = useState<string>('');
  const [action, setAction] = useState<NotificationAction>(NotificationAction.HOME);
  const [isAnnouncement, setIsAnnouncement] = useState<boolean>(true);
  const [arbitraryData, setArbitraryData] = useState<Record<string, string>>(defaultValArbitraryData);

  const upsertArbData = (key: string, value: string) => {
    setArbitraryData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeArbData = (key: string) => {
    setArbitraryData(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearInput = (id: string) => {
    const element = document.getElementById(id);
    if (element instanceof HTMLInputElement) {
      element.value = '';
    }
  };

  const handleInputTitleChanged = (value: string) => {
    setTitle(value);
  };

  const handleInputMessageChanged = (value: string) => {
    setMessage(value);
  };

  const handleCheckBoxIsAnnounementChanged = () => {
    const hasKey = Object.prototype.hasOwnProperty.call(arbitraryData, 'isAnnouncement');
    if (hasKey) {
      removeArbData('isAnnouncement');
    } else {
      upsertArbData('isAnnouncement', 'true');
    }

    setIsAnnouncement(!hasKey);
  };

  const handleInputArbitraryDataChanged = (key: string, value: string) => {
    if (value) {
      upsertArbData(key, value);
    } else {
      removeArbData(key);
    }
  };

  const handleSubmitClicked = async () => {
    let dataOk = false;
    try {
      // todo: data validation
      dataOk = true;
    } catch (error: any) {
      const message = `Arbitrary data: ${error.message}`;
      toast.error(message);
      console.error(message);
    }

    if (dataOk) {
      try {
        await createBroadcast(title, message, action, arbitraryData, session);
        toast.success('Broadcast successful');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={'Broadcast'} />

        <div className="mx-2 rounded-lg border border-primary bg-secondary-light overflow-y-auto gap-2 p-2">
          <div>
            <TextInput
              id={'title'}
              label={'Title'}
              value={title}
              onChange={e => {
                handleInputTitleChanged(e.currentTarget.value);
              }}
            />
          </div>

          <div className="h-64 w-full rounded-lg bg-secondary-light">
            <TextInputLarge
              id={'message'}
              label={'Message'}
              value={message}
              onChange={e => {
                handleInputMessageChanged(e.currentTarget.value);
              }}
            />
          </div>

          <div className="mx-2 flex items-center gap-2">
            <div>{`Action`}</div>
            <div className="flex w-full">
              <ComboBox
                menus={menuNotificationActions}
                value={action}
                searchEnabled={false}
                onChange={(value: NotificationAction) => {
                  setAction(value);
                }}
              />
            </div>
          </div>

          <CheckBox
            id={'isAnnouncement'}
            label={'Is Announcement'}
            value={isAnnouncement}
            onChange={e => {
              handleCheckBoxIsAnnounementChanged();
            }}
          />

          <div className="mx-2 flex flex-col gap-2">
            {arbDataItems.map(item => {
              return (
                <div key={`row-${item}`} className="flex gap-2 items-center">
                  <div className="w-1/4">{item}</div>

                  <div className="flex w-full gap-2 items-center">
                    <input
                      id={`inputArbData-${item}`}
                      className="h-full w-full rounded-lg border border-secondary-dark p-1"
                      onChange={e => {
                        handleInputArbitraryDataChanged(item, e.currentTarget.value);
                      }}
                    />

                    <ActionButton
                      action={Action.DELETE}
                      onClick={() => {
                        clearInput(`inputArbData-${item}`);
                        removeArbData(item);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full">
            <TextInput id={'arbitraryData'} label={'Arbitrary Data'} value={JSON.stringify(arbitraryData)} readOnly={true} />
          </div>
        </div>

        <Navigation>
          <Link href={routeAdminOverview}>
            <ActionButton action={Action.BACK} />
          </Link>

          <TextButton text={'Submit'} onClick={handleSubmitClicked} />
        </Navigation>
      </div>
    </>
  );
}
