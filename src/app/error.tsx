'use client';

import { imgNotFound } from '@/domain/constants/images';
import { routeHome } from '@/domain/constants/routes';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ErrorPage({ error }: { error: Error }) {
  const t = useTranslations('/error');

  useEffect(() => {
    console.error(`${error}`);
  }, [error]);

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2">
        <Image src={imgNotFound} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} priority={true} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{t('textError')}</div>
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
