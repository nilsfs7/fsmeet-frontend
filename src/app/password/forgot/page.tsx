'use client';

import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import { useRouter } from 'next/navigation';
import { routeLogin, routePasswordPending } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { Toaster, toast } from 'sonner';
import { createPasswordReset } from '@/infrastructure/clients/user.client';

export default function ForgotPassword() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.target.value;
    setUsernameOrEmail(uname.toLowerCase());
  };

  const handleInputKeypressUsername = (e: any) => {
    if (e.keyCode === 13) {
      handleResetClicked();
    }
  };

  const handleResetClicked = async () => {
    try {
      await createPasswordReset(usernameOrEmail);
      router.replace(routePasswordPending);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className={'absolute inset-0 flex flex-col'}>
        <div className="p-2 h-full grid overflow-y-auto">
          <div className={'h-full flex flex-col items-center justify-center'}>
            <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
              <TextInput
                id={'usernameOrEmail'}
                label={'Username / Email'}
                placeholder="max"
                value={usernameOrEmail}
                onChange={(e) => {
                  handleInputChangeUsername(e);
                }}
                onKeyDown={handleInputKeypressUsername}
              />
            </div>

            <div className="flex justify-center py-2">
              <TextButton text="Reset Password" onClick={handleResetClicked} />
            </div>
          </div>
        </div>

        <Navigation>
          <Link href={routeLogin}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
}
