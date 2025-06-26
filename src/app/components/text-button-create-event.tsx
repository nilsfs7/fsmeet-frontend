'use client';

import TextButton from '@/components/common/TextButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Dialog from '@/components/Dialog';
import { routeEventsCreate, routeHome } from '@/domain/constants/routes';
import { useEffect, useState } from 'react';
import { License } from '@/types/license';
import { getLicense } from '@/infrastructure/clients/license.client';

export const TextButtonCreateEvent = () => {
  const t = useTranslations('/');

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

  const handleCreateClicked = async () => {
    if (license && license.amountEventLicenses > 0) {
      router.push(routeEventsCreate);
    } else {
      router.replace(`${routeHome}?license=1`);
    }
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeHome}`);
  };

  return (
    <>
      <Dialog title="License Warning" queryParam="license" onCancel={handleCancelDialogClicked}>
        <p>Out of licenses to create new events. Contact us to get more.</p>
        <p>By deleting any event that is not listed publicly, you can reclaim 1 license. Note that once an event is public it is not eligible for a reclaim.</p>
      </Dialog>

      <TextButton text={t('btnCreateEvent')} onClick={handleCreateClicked} />
    </>
  );
};
