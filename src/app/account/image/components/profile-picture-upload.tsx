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
import { IconPhotoUp, IconTrash, IconUpload } from '@tabler/icons-react';

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

  const previewUrl = createObjectURL ? createObjectURL : imageUrl ? imageUrl : imgUserDefaultImg;

  return (
    <>
      <Toaster richColors />

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <section className="flex w-full max-w-md min-w-0 flex-col items-center gap-5 rounded-3xl border border-border bg-background p-6 shadow-xs sm:p-8">
          <img src={previewUrl} alt="" className="h-40 w-40 rounded-full bg-muted object-cover ring-4 ring-brand-soft" />

          <label
            className={cn(
              'flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-6 text-center transition-colors',
              'hover:border-brand/50 hover:bg-brand-soft/30 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30',
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
              <IconPhotoUp className="h-5 w-5" stroke={1.75} aria-hidden />
            </span>
            <span className="text-sm font-semibold text-foreground">{image ? image.name : t('lblChooseImage')}</span>
            <span className="text-xs text-muted-foreground">{t('hintImage')}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={uploadToClient} />
          </label>

          <div className="flex w-full flex-col gap-2 sm:flex-row-reverse">
            {createObjectURL && createObjectURL.length > 0 && (
              <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-11 min-w-0 flex-1')} onClick={handleUploadImageClicked}>
                <IconUpload className="h-4 w-4" stroke={2} aria-hidden />
                {t('btnUpload')}
              </Button>
            )}

            {imageUrl.length > 0 && (
              <Button
                type="button"
                variant="outline"
                className="h-11 min-w-0 flex-1 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDeleteImageClicked}
              >
                <IconTrash className="h-4 w-4" stroke={1.75} aria-hidden />
                {t('btnDelete')}
              </Button>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
