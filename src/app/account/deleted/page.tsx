'use client';

import Link from 'next/link';
import TextButton from '@/components/common/text-button';
import Image from 'next/image';
import { routeHome } from '@/domain/constants/routes';
import { imgGoodBye } from '@/domain/constants/images';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function AccountDeleted() {
  const t = useTranslations('/account/deleted');

  useEffect(() => {
    // Sign out from NextAuth
    signOut({ redirect: false });

    // Clear localStorage after successful logout
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
  }, []);

  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2">
        <Image src={imgGoodBye} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
        <div className="m-1 text-center text-lg font-bold">
          <div>{t('textGoodbye')}</div>
          <div>{t('textConfirmation')}</div>
        </div>
      </div>

      <div className="py-2">
        <Link href={routeHome}>
          <TextButton text={t('btnBackHome')} />
        </Link>
      </div>
    </div>
  );
}
