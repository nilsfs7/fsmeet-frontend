'use client';

import { imgUserAddImg } from '@/domain/constants/images';
import { routeAccountImage } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const AVATAR_RING = cn(
  'h-32 w-32 shrink-0 rounded-full border border-border/60 object-cover shadow-xs',
  'transition-colors hover:border-primary/60 dark:border-border/50',
);

const PLACEHOLDER_SURFACE = cn(
  'flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-full border border-border/60',
  'bg-secondary-light/85 p-2 text-center shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'transition-colors hover:border-primary/60 dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

export const ProfilePicture = () => {
  const t = useTranslations('/account');

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(localStorage.getItem('imageUrl') || '');
  }, []);

  return (
    <div className="flex justify-center py-2">
      <Link href={routeAccountImage} className="block min-w-0">
        {!imageUrl && (
          <div className={PLACEHOLDER_SURFACE}>
            <img className="w-16 shrink-0 object-contain" src={imgUserAddImg} alt="" />
            <span className="text-sm font-medium leading-tight text-foreground/90">{t('profilePictureAddPicture')}</span>
          </div>
        )}

        {imageUrl && <img src={imageUrl} alt="" className={AVATAR_RING} />}
      </Link>
    </div>
  );
};
