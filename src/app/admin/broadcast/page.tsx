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

const defaultValArbitraryData = '{  }';

export default function Broadcast() {
  const { data: session } = useSession();

  const [title, setTitle] = useState<string>('Admin Announcement');
  const [message, setMessage] = useState<string>('');
  const [action, setAction] = useState<NotificationAction>(NotificationAction.HOME);
  const [arbitraryData, setArbitraryData] = useState<string>(defaultValArbitraryData);

  const handleInputTitleChanged = (value: string) => {
    setTitle(value);
  };

  const handleInputMessageChanged = (value: string) => {
    setMessage(value);
  };

  const handleInputArbitraryDataChanged = (value: string) => {
    setArbitraryData(value);
  };

  const handleSubmitClicked = async () => {
    let dataOk = false;
    try {
      // check arbitrary data conversion
      JSON.parse(arbitraryData);
      dataOk = true;
    } catch (error: any) {
      const message = `Arbitrary data: ${error.message}`;
      toast.error(message);
      console.error(message);
    }

    if (dataOk) {
      await createBroadcast(title, message, action, JSON.parse(arbitraryData), session);
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
                label="dncj"
                menus={menuNotificationActions}
                value={action}
                searchEnabled={false}
                onChange={(value: NotificationAction) => {
                  setAction(value);
                }}
              />
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full">
              <TextInput
                id={'arbitraryData'}
                label={'Arbitrary Data'}
                value={arbitraryData}
                onChange={e => {
                  handleInputArbitraryDataChanged(e.currentTarget.value);
                }}
              />
            </div>

            <ActionButton
              action={Action.DELETE}
              onClick={() => {
                setArbitraryData(defaultValArbitraryData);
              }}
            />
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
