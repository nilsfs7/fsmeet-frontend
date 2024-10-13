'use client';

import TextButton from '@/components/common/TextButton';
import { routeEventSubs, routeEventsCreate } from '@/domain/constants/routes';
import { getLicense } from '@/infrastructure/clients/license.client';
import { License } from '@/types/license';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const TextButtonCreateEvent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [license, setLicense] = useState<License>();

  useEffect(() => {
    if (session) {
      getLicense(session, session.user.username).then((lic) => {
        setLicense(lic);
      });
    }
  }, [session]);

  const handleCreateEventClicked = async () => {
    if (license && license.amountEventLicenses > 0) {
      router.push(routeEventsCreate);
    } else {
      router.replace(`${routeEventSubs}/?license=1`);
    }
  };

  return <TextButton text="Create Event" onClick={handleCreateEventClicked} />;
};
