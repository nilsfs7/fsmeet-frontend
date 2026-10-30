'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeEventsCreate, routeLogin } from '@/domain/constants/routes';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const EventManageCreateEventButton = () => {
  const t = useTranslations('/events/manage');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateEventClicked = async () => {
    if (session) {
      router.push(routeEventsCreate);
    } else {
      router.push(routeLogin);
    }
  };

  return (
    <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleCreateEventClicked}>
      {t('btnCreate')}
    </Button>
  );
};
