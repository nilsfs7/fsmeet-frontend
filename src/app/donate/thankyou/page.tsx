import Link from 'next/link';
import { imgThumbsUp } from '@/domain/constants/images';
import { routeHome } from '@/domain/constants/routes';
import Image from 'next/image';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

export default async function ThankYou() {
  const t = await getTranslations('/donate/thankyou');

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2">
        <Image src={imgThumbsUp} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{t('thankYouText1')}</div>
          <div>{t('thankYouText2')}</div>
        </div>
      </div>

      <div className="py-2">
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeHome}>{t('btnBackHome')}</Link>
        </Button>
      </div>
    </div>
  );
}
