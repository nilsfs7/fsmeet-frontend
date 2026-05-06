import Link from 'next/link';
import Image from 'next/image';
import { imgThumbsUp } from '@/domain/constants/images';
import { routeEvents } from '@/domain/constants/routes';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

export default async function EventProLicensePurchaseSuccess(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/pro/purchase/success');

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center px-4 py-4 sm:px-6 md:px-8">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-2 py-6 text-center">
        <Image src={imgThumbsUp} width={0} height={0} sizes="100vw" className="h-12 w-full max-w-xs object-contain" alt="" />
        <p className="type-body-sm text-foreground/90">{t('thankYouText1')}</p>
        <p className="type-body-sm text-foreground/90">{t('thankYouText2')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="action" className={ctaActionButtonClassName}>
            <Link href={`${routeEvents}/${params.eventId}`}>{t('btnEvent')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
