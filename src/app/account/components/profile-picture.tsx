'use client';

import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeAccountImage, routeUsers } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconCamera, IconUserCircle } from '@tabler/icons-react';

interface IProfilePicture {
  username: string;
  displayName?: string;
  /** Server-side image URL; the locally cached one (set after an upload) wins. */
  imageUrl?: string;
}

/** Account header: avatar (links to picture upload), name, username and quick actions. */
export const ProfilePicture = ({ username, displayName, imageUrl: initialImageUrl }: IProfilePicture) => {
  const t = useTranslations('/account');

  const [imageUrl, setImageUrl] = useState(initialImageUrl || '');

  useEffect(() => {
    const cached = localStorage.getItem('imageUrl');
    if (cached) setImageUrl(cached);
  }, []);

  return (
    <section className="flex w-full max-w-2xl flex-col items-center gap-4 self-center rounded-3xl border border-border bg-background p-5 shadow-xs sm:flex-row sm:p-6">
      <Link
        href={routeAccountImage}
        className="group relative block shrink-0 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand"
        aria-label={t('btnChangePicture')}
      >
        <img src={imageUrl || imgUserDefaultImg} alt="" className="h-24 w-24 rounded-full bg-muted object-cover ring-1 ring-border sm:h-20 sm:w-20" />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-brand text-brand-foreground shadow-sm transition-transform group-hover:scale-105">
          <IconCamera className="h-4 w-4" stroke={2} aria-hidden />
        </span>
      </Link>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <div className="truncate text-xl font-semibold text-foreground">{displayName || username}</div>
        <div className="truncate text-sm text-muted-foreground">@{username}</div>
        {!imageUrl && <div className="mt-1 text-xs text-muted-foreground">{t('profilePictureAddPicture')}</div>}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild variant="outline" className="h-10 rounded-xl px-4">
          <Link href={`${routeUsers}/${username}`}>
            <IconUserCircle className="h-4 w-4" stroke={1.75} aria-hidden />
            {t('btnViewProfile')}
          </Link>
        </Button>
      </div>
    </section>
  );
};
