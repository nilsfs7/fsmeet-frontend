'use client';

import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { routeEventsCreate } from '@/domain/constants/routes';

export function UnlistedEventsCreateDialog({
  open,
  message,
  onOpenChange,
}: {
  open: boolean;
  message?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations(routeEventsCreate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pr-6 text-base font-medium leading-snug">{message ?? t('dlgUnlistedEvents')}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
