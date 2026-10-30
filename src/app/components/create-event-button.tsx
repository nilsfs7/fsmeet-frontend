'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { routeEventsCreate, routeLogin } from '@/domain/constants/routes';

export const CreateEventButton = () => {
  const t = useTranslations('/');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateClicked = async () => {
    if (session) {
      router.push(routeEventsCreate);
    } else {
      router.push(routeLogin);
    }
  };

  return (
    <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleCreateClicked}>
      {t('btnCreateEvent')}
    </Button>
  );
};
