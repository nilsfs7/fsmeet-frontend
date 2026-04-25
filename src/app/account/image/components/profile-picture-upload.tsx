'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { deleteUserImage, updateUserImage } from '@/infrastructure/clients/user.client';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeAccount } from '@/domain/constants/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Toaster, toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/** Same as sponsor-editor / accommodation-editor file input. */
const FILE_INPUT_CLASS = cn(
  'w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground',
);

export const ProfilePictureUpload = () => {
  const t = useTranslations('/account/image');
  const { data: session } = useSession();

  const router = useRouter();

  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState<File>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();

  useEffect(() => {
    setImageUrl(localStorage.getItem('imageUrl') || '');
  }, []);

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleUploadImageClicked = async () => {
    try {
      const nextUrl = await updateUserImage(image, session);
      setImageUrl(nextUrl);
      localStorage.setItem('imageUrl', nextUrl);
      router.replace(routeAccount);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg);
      console.error(msg);
    }
  };

  const handleDeleteImageClicked = async () => {
    try {
      await deleteUserImage(session);
      setImageUrl('');
      localStorage.removeItem('imageUrl');
      router.replace(routeAccount);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg);
      console.error(msg);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-4 sm:px-6 md:px-8">
        <div className="flex w-full max-w-2xl min-w-0 flex-col gap-4">
          <div className="flex justify-center py-2">
            <img
              src={createObjectURL ? createObjectURL : imageUrl ? imageUrl : imgUserDefaultImg}
              alt=""
              className="mx-2 flex h-32 w-32 rounded-full border border-border/60 object-cover"
            />
          </div>

          <div className="flex flex-col items-center py-2">
            <input type="file" accept="image/*" className={cn(FILE_INPUT_CLASS, 'w-fit max-w-full')} onChange={uploadToClient} />
          </div>

          <div className="flex flex-col items-center gap-2 py-2 sm:flex-row sm:justify-center">
            {imageUrl.length > 0 && (
              <Button type="button" variant="actionCritical" className={ctaActionButtonClassName} onClick={handleDeleteImageClicked}>
                {t('btnDelete')}
              </Button>
            )}

            {createObjectURL && createObjectURL.length > 0 && (
              <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleUploadImageClicked}>
                {t('btnUpload')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
