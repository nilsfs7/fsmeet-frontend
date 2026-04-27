'use client';

import { useState } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import TextInput from '@/components/common/text-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { routeLogin } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { Toaster, toast } from 'sonner';
import { updateUserPassword } from '@/infrastructure/clients/user.client';
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

export default function ResetPassword() {
  const t = useTranslations('/password/reset');
  const router = useRouter();

  const searchParams = useSearchParams();
  const requestToken = searchParams?.get('requestToken');

  const [password, setPassword] = useState('');

  const handleInputChangePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleSaveClicked();
    }
  };

  const handleSaveClicked = async () => {
    if (!requestToken) {
      toast.error(t('errorMissingResetLink'));
      return;
    }

    try {
      await updateUserPassword(requestToken, password);
      router.replace(routeLogin);
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
                id={'password'}
                type={'password'}
                label={t('inputPassword')}
                placeholder="Ball&Chill2021"
                value={password}
                onChange={e => {
                  handleInputChangePassword(e);
                }}
                onKeyDown={handleInputKeypressPassword}
              />

              <div className="w-full min-w-0">
                <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'w-full min-w-0')} onClick={handleSaveClicked}>
                  {t('btnSave')}
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
