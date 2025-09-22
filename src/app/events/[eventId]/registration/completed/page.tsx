'use client';

import TextButton from '@/components/common/TextButton';
import { imgCelebration } from '@/domain/constants/images';
import { routeEvents } from '@/domain/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function EventRegistrationCompleted({ params }: { params: { eventId: string } }) {
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
    <div className={'absolute inset-0 flex flex-col'}>
      <div className="p-2 h-full grid overflow-y-auto">
        <div className={'h-full flex flex-col justify-center'}>
          <div className="mx-2 text-center">
            <Image src={imgCelebration} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={''} />
            <div className="mt-2">{t('registrationSuccess')}</div>

            {checkout && <div className="mt-2">{t(`textPaymentCompleted`)}</div>}
            {!checkout && eventHasFee && <div className="mt-2">{t(`textPaymentOutstanding`)}</div>}

            <div className="mt-2">
              <Link href={`${routeEvents}/${params.eventId}`}>
                <TextButton text={buttonDisabled ? `${secUntilEnabled.toString()} ...` : t('btnBack')} disabled={buttonDisabled} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
