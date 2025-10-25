'use client';

import TextButton from '@/components/common/text-button';
import { deleteUserImage, updateUserImage } from '@/infrastructure/clients/user.client';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeAccount } from '@/domain/constants/routes';
import { ButtonStyle } from '@/domain/enums/button-style';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { useTranslations } from 'next-intl';

export const ProfilePictureUpload = () => {
  const t = useTranslations('/account/image');
  const { data: session, status } = useSession();

  const router = useRouter();

  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState<File>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();

  useEffect(() => {
    const imageUrl = localStorage.getItem('imageUrl'); // TODO: get url from session, session must be uptodate
    setImageUrl(imageUrl || '');
  }, [imageUrl]);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleUploadImageClicked = async () => {
    try {
      const imageUrl = await updateUserImage(image, session);

      setImageUrl(imageUrl);
      localStorage.setItem('imageUrl', imageUrl);
      router.replace(routeAccount);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteImageClicked = async () => {
    try {
      await deleteUserImage(session);

      setImageUrl('');
      localStorage.removeItem('imageUrl');
      router.replace(routeAccount);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    const imageUrl = localStorage.getItem('imageUrl'); // TODO: get url from session, session must be uptodate
    setImageUrl(imageUrl || '');
  }, [imageUrl]);

  return (
    <>
      <Toaster richColors />

      <div className="flex justify-center py-2">
        <img src={createObjectURL ? createObjectURL : imageUrl ? imageUrl : imgUserDefaultImg} className="mx-2 flex h-32 w-32 rounded-full object-cover border border-primary" />
      </div>

      <div className="flex justify-center py-2">
        <input type="file" onChange={uploadToClient} />
      </div>

      <div className="flex justify-center py-2">
        {imageUrl && imageUrl.length > 0 && (
          <div className="mx-1">
            <TextButton text={t('btnDelete')} onClick={handleDeleteImageClicked} style={ButtonStyle.CRITICAL} />
          </div>
        )}

        {createObjectURL && createObjectURL.length > 0 && (
          <div className="mx-1">
            <TextButton text={t('btnUpload')} onClick={handleUploadImageClicked} />
          </div>
        )}
      </div>
    </>
  );
};
