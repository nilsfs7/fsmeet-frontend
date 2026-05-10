import { imgNotFound } from '@/domain/constants/images';
import Link from 'next/link';
import Image from 'next/image';
import { routeEvents } from '@/domain/constants/routes';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('/events/eventid/not-found');
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2">
        <Image src={imgNotFound} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} priority={true} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{t('textNotFound')}</div>
        </div>
      </div>

      <div className="py-2">
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeEvents}>{t('btnBackToEvents')}</Link>
        </Button>
      </div>
    </div>
  );
}
