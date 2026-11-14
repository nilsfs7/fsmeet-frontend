'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface IImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  /** accessible title of the dialog (e.g. event name) */
  title: string;
  alt?: string;
}

/**
 * Near-fullscreen image preview: dark backdrop, image scaled to fit 92vw × 90dvh (aspect ratio kept),
 * closes via the X button, ESC, or a click/tap anywhere outside the image.
 */
export function ImageLightbox({ open, onOpenChange, src, title, alt = '' }: IImageLightboxProps) {
  const t = useTranslations('global/ui');
  // natural aspect ratio of the image, so small source images are scaled up to fill the screen (90dvh / 92vw) instead of rendering tiny
  const [ratio, setRatio] = useState<number>();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          data-testid="image-lightbox"
          className="fixed inset-0 z-[200] flex items-center justify-center p-[max(1rem,env(safe-area-inset-top,0px))] outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          // the content covers the viewport, so "outside" is any click that is not on the image or the close button
          onClick={event => {
            if (event.target === event.currentTarget) onOpenChange(false);
          }}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <img
            src={src}
            alt={alt}
            onLoad={event => {
              const img = event.currentTarget;
              if (img.naturalWidth && img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight);
            }}
            style={ratio ? { width: `min(92vw, calc(90dvh * ${ratio}))` } : undefined}
            className="block h-auto max-h-[90dvh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
            data-testid="image-lightbox-img"
          />
          <DialogPrimitive.Close
            className="absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            aria-label={t('close')}
            data-testid="image-lightbox-close"
          >
            <IconX className="h-5 w-5" stroke={2} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
