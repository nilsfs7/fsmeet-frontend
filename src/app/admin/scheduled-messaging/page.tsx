'use client';

import { useState } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeAdminOverview } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/page-title';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import ComboBox from '@/components/common/combo-box';
import { scheduleMapListingReminders } from '@/infrastructure/clients/user.client';
import { PageInset } from '@/components/layout/page-inset';

enum ScheduledMessageType {
  MAP_LISTING = 'map_listing',
}

const scheduledMessageMenus = [{ value: ScheduledMessageType.MAP_LISTING, text: 'Freestyler map listing' }];

export default function ScheduledMessaging() {
  const { data: session } = useSession();
  const [messageType, setMessageType] = useState<ScheduledMessageType>(ScheduledMessageType.MAP_LISTING);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScheduleClicked = async () => {
    if (messageType !== ScheduledMessageType.MAP_LISTING) return;

    setIsSubmitting(true);
    try {
      const { scheduledCount } = await scheduleMapListingReminders(session);
      toast.success(`Scheduled ${scheduledCount} map listing reminder${scheduledCount === 1 ? '' : 's'}.`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to schedule messages';
      toast.error(message);
      console.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title="Scheduled Messaging" />

        <PageInset className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <div className="rounded-lg border border-primary bg-secondary-light p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <div className="shrink-0 text-sm font-medium">Message</div>
                <div className="min-w-0 flex-1">
                  <ComboBox
                    menus={scheduledMessageMenus}
                    value={messageType}
                    searchEnabled={false}
                    onChange={(value: string) => {
                      setMessageType(value as ScheduledMessageType);
                    }}
                  />
                </div>
              </div>

              <p className="type-body-sm text-foreground/80">Schedules a reminder for every freestyler who is not listed on the freestyler map.</p>
            </div>
          </div>
        </PageInset>

        <Navigation>
          <ActionButton href={routeAdminOverview} action={Action.BACK} />

          <Button type="button" variant="action" className={ctaActionButtonClassName} disabled={isSubmitting} onClick={handleScheduleClicked}>
            {isSubmitting ? 'Scheduling…' : 'Schedule'}
          </Button>
        </Navigation>
      </div>
    </>
  );
}
