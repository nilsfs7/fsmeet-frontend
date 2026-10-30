'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UNLISTED_EVENTS_CREATE_MESSAGE } from '@/functions/unlisted-events';

export function UnlistedEventsCreateDialog({
  open,
  message = UNLISTED_EVENTS_CREATE_MESSAGE,
  onOpenChange,
}: {
  open: boolean;
  message?: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pr-6 text-base font-medium leading-snug">{message}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
