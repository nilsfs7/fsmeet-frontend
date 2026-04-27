'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';

export function OpenArenaPreviewButton({ eventId }: { eventId: string }) {
  return (
    <Button
      type="button"
      variant="action"
      className={ctaActionButtonClassName}
      onClick={() => window.open(`/events/${eventId}/arena-screen/preview`, '_blank', 'noopener,noreferrer')}
    >
      Open arena screen
    </Button>
  );
}
