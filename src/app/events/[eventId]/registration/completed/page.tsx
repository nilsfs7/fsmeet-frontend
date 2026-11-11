'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/auth-card';
import { cn } from '@/lib/utils';
import { IconConfetti } from '@tabler/icons-react';
import { routeEvents } from '@/domain/constants/routes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { use, useEffect, useState } from 'react';

export default function EventRegistrationCompleted(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/registration/completed');

  const searchParams = useSearchParams();
  const checkout = searchParams?.get('checkout') === '1';
  const eventHasFee = searchParams?.get('fee') === '1';

  const [buttonDisabled, setButtonDisabled] = useState(checkout);
  const [secUntilEnabled, setSecondsUntilEnabled] = useState(buttonDisabled ? 4 : 0);

  useEffect(() => {
    if (buttonDisabled) {
      const timer = setTimeout(() => {
        if (secUntilEnabled > 0) {
          const newSecUntilEnabled = secUntilEnabled - 1;

          setSecondsUntilEnabled(newSecUntilEnabled);

          if (newSecUntilEnabled <= 0) {
            setButtonDisabled(false);
          }
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [secUntilEnabled]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard
        icon={<IconConfetti stroke={1.75} aria-hidden />}
        title={t('registrationSuccess')}
        description={
          (checkout || eventHasFee) && (
            <>
              {checkout && <p>{t('textPaymentCompleted')}</p>}
              {!checkout && eventHasFee && <p>{t('textPaymentOutstanding')}</p>}
            </>
          )
        }
      >
        {buttonDisabled ? (
          <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')} disabled>
            {`${secUntilEnabled.toString()} ...`}
          </Button>
        ) : (
          <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
            <Link href={`${routeEvents}/${params.eventId}`}>{t('btnBack')}</Link>
          </Button>
        )}
      </AuthCard>
    </div>
  );
}
