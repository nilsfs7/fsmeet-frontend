import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { IconConfetti } from '@tabler/icons-react';
import { AuthCard } from '@/components/auth/auth-card';
import { cn } from '@/lib/utils';
import { routeEvents, routeEventsCreate } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/animation/loading-spinner';

export default async function EventCreateSuccessPage(props: { searchParams: Promise<{ eventId?: string }> }) {
  const session = await auth();
  if (!session?.user.username) {
    return <LoadingSpinner />;
  }

  const searchParams = await props.searchParams;
  const eventId = searchParams?.eventId;

  if (!eventId) {
    redirect(routeEventsCreate);
  }

  const t = await getTranslations('/events/create');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard
        icon={<IconConfetti stroke={1.75} aria-hidden />}
        title={t('pageSuccessSuccessText1')}
        description={
          <>
            <p>{t('pageSuccessSuccessText2')}</p>
            <p className="mt-2 text-xs">{t('reviewHintUnlisted')}</p>
          </>
        }
      >
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={`${routeEvents}/${eventId}/edit`}>{t('pageSuccessBtnEditEvent')}</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 w-full min-w-0 rounded-xl text-base font-semibold">
          <Link href={`${routeEvents}/${eventId}`}>{t('pageSuccessBtnShowEvent')}</Link>
        </Button>
      </AuthCard>
    </div>
  );
}
