'use client';

import TextButton from '@/components/common/text-button';

export function OpenArenaPreviewButton({ eventId }: { eventId: string }) {
  return (
    <TextButton
      text="Open arena screen"
      onClick={() => window.open(`/events/${eventId}/arena-screen/preview`, '_blank', 'noopener,noreferrer')}
    />
  );
}
