'use client';

import { imgUserAddImg } from '@/domain/constants/images';
import { routeAccountImage } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ProfilePicture = () => {
  const t = useTranslations('/account');

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const imageUrl = localStorage.getItem('imageUrl'); // TODO: get url from session, session must be uptodate
    setImageUrl(imageUrl || '');
  }, [imageUrl]);

  return (
    <div className="flex justify-center py-2">
      <Link href={routeAccountImage}>
        {!imageUrl && (
          <div className="mx-2 flex h-32 w-32 rounded-full border border-primary hover:bg-secondary justify-center">
            <div className="w-24 flex flex-col justify-center items-center text-center gap-1">
              <img className="w-16" src={imgUserAddImg} />
              <div className="text-sm">{t('profilePictureAddPicture')}</div>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="flex justify-center py-2">
            <img src={imageUrl} className="mx-2 flex h-32 w-32 rounded-full object-cover border border-secondary-dark hover:border-primary" />
          </div>
        )}
      </Link>
    </div>
  );
};
