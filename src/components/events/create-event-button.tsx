'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { UnlistedEventsCreateDialog } from '@/components/events/unlisted-events-create-dialog';
import { routeEventsCreate, routeLogin } from '@/domain/constants/routes';
import { isBlockedByUnlistedEvents } from '@/functions/unlisted-events';
import { getEvents } from '@/infrastructure/clients/event.client';

export function CreateEventButton({ label }: { label: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (status === 'loading' || checking) return;
    if (!session?.user?.username) {
      router.push(routeLogin);
      return;
    }

    setChecking(true);
    try {
      const events = await getEvents(session.user.username, null, null, null, null, session);
      if (!Array.isArray(events)) throw new Error('Events could not be loaded.');
      if (isBlockedByUnlistedEvents(events)) {
        setBlocked(true);
        return;
      }
      router.push(routeEventsCreate);
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(error instanceof Error && error.message ? error.message : 'Events could not be loaded.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <UnlistedEventsCreateDialog
        open={blocked || errorMessage !== null}
        message={errorMessage ?? undefined}
        onOpenChange={open => {
          if (!open) {
            setBlocked(false);
            setErrorMessage(null);
          }
        }}
      />
      <Button type="button" variant="action" className={ctaActionButtonClassName} disabled={status === 'loading' || checking} onClick={() => void handleClick()}>
        {label}
      </Button>
    </>
  );
}
