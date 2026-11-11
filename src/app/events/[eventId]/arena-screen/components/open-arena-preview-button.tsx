'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function OpenArenaPreviewButton({ eventId }: { eventId: string }) {
  const t = useTranslations('/events/eventid/arena-screen');
  return (
    <Button
      type="button"
      variant="action"
      className={ctaActionButtonClassName}
      onClick={() => window.open(`/events/${eventId}/arena-screen/preview`, '_blank', 'noopener,noreferrer')}
    >
      {t('btnOpen')}
    </Button>
  );
}
