import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { imgCelebration } from '@/domain/constants/images';
import { routeEvents, routeEventsCreate } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import Image from 'next/image';
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
    <div className="flex min-h-0 flex-1 flex-col justify-center px-4 py-4 sm:px-6 md:px-8">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-2 py-6 text-center">
        <Image src={imgCelebration} width={0} height={0} sizes="100vw" className="h-12 w-full max-w-xs object-contain" alt="" />
        <p className="type-body-sm text-foreground/90">{t('pageSuccessSuccessText1')}</p>
        <p className="type-body-sm text-foreground/90">{t('pageSuccessSuccessText2')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="action" className={ctaActionButtonClassName}>
            <Link href={`${routeEvents}/${eventId}/edit`}>{t('pageSuccessBtnEditEvent')}</Link>
          </Button>
          <Button asChild variant="action" className={ctaActionButtonClassName}>
            <Link href={`${routeEvents}/${eventId}`}>{t('pageSuccessBtnShowEvent')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
