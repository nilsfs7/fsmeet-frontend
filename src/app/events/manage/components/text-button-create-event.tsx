'use client';

import TextButton from '@/components/common/TextButton';
import { routeEventSubs, routeEventsCreate, routeLogin } from '@/domain/constants/routes';
import { getLicense } from '@/infrastructure/clients/license.client';
import { License } from '@/domain/types/license';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const TextButtonCreateEvent = () => {
  const t = useTranslations('/events/manage');

  const { data: session } = useSession();
  const router = useRouter();

  const [license, setLicense] = useState<License>();

  useEffect(() => {
    if (session) {
      getLicense(session, session.user.username).then(lic => {
        setLicense(lic);
      });
    }
  }, [session]);

  const handleCreateEventClicked = async () => {
    if (session) {
      if (license && license.amountEventLicenses > 0) {
        router.push(routeEventsCreate);
      } else {
        router.replace(`${routeEventSubs}/?license=1`);
      }
    } else {
      router.push(routeLogin);
    }
  };

  return <TextButton text={t('btnCreate')} onClick={handleCreateEventClicked} />;
};
