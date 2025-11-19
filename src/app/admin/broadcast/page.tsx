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

export default function Broadcast() {
  const { data: session } = useSession();

  const [title, setTitle] = useState('Admin Announcement');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(NotificationAction.HOME);

  const handleInputTitleChanged = (value: string) => {
    setTitle(value);
  };

  const handleInputMessageChanged = (value: string) => {
    setMessage(value);
  };

  const handleSubmitClicked = async () => {
    try {
      await createBroadcast(title, message, action, session);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={'Broadcast'} />

        <div className="mx-2 flex flex-col rounded-lg border border-primary bg-secondary-light overflow-y-auto gap-2 p-2">
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
