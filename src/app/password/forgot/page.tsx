'use client';

import { useState } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import TextInput from '@/components/common/text-input';
import { useRouter } from 'next/navigation';
import { routeLogin, routePasswordPending } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { Toaster, toast } from 'sonner';
import { createPasswordReset } from '@/infrastructure/clients/user.client';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/** @see `competition-editor.tsx` `EDITOR_CARD_CLASS` */
const EDITOR_CARD_CLASS = cn(
  'flex w-full min-w-0 max-w-lg flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
  'sm:gap-3 sm:p-3',
);

export default function ForgotPassword() {
  const t = useTranslations('/password/forgot');

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

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
          <div className="flex min-h-full flex-col items-center justify-center py-4">
            <div className={EDITOR_CARD_CLASS}>
              <TextInput
                id={'usernameOrEmail'}
                label={t('inputUsername')}
                placeholder="max"
                value={usernameOrEmail}
                onChange={e => {
                  handleInputChangeUsername(e);
                }}
                onKeyDown={handleInputKeypressUsername}
              />

              <div className="w-full min-w-0">
                <Button
                  type="button"
                  variant="action"
                  className={cn(ctaActionButtonClassName, 'w-full min-w-0')}
                  onClick={handleResetClicked}
                >
                  {t('btnResetPassword')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Navigation>
          <div className="flex justify-start gap-1">
            <ActionButton href={routeLogin} action={Action.BACK} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
