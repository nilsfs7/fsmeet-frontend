'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconKey } from '@tabler/icons-react';
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
import { AuthCard } from '@/components/auth/auth-card';

export default function ForgotPassword() {
  const t = useTranslations('/password/forgot');

  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    if (submitting || !usernameOrEmail.trim()) return;
    setSubmitting(true);
    try {
      await createPasswordReset(usernameOrEmail);
      router.replace(routePasswordPending);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
          <AuthCard
            icon={<IconKey stroke={1.75} aria-hidden />}
            title={t('pageTitle')}
            description={t('pageDescription')}
            footer={
              <Link href={routeLogin} className="font-medium text-foreground/90 underline-offset-2 hover:underline">
                {t('lnkBackToLogin')}
              </Link>
            }
          >
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

            <Button
              type="button"
              variant="action"
              className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}
              onClick={handleResetClicked}
              disabled={submitting || !usernameOrEmail.trim()}
            >
              {t('btnResetPassword')}
            </Button>
          </AuthCard>
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
