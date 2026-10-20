'use client';

/**
 * URL query–driven video lightbox (e.g. `?trailer=1`).
 * Portals to `document.body` so `position: fixed` stays viewport-relative.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import ActionButton from './common/action-button';
import { Action } from '@/domain/enums/action';
import { cn } from '@/lib/utils';

/** Above app overlays (e.g. event poster preview) and aligned with the URL query dialog. */
const VIDEO_DIALOG_Z = 'z-[200]';

interface IVideoDialogProps {
  queryParam: string;
  videoUrl: string;
  onCancel: () => void;
}

function toEmbedUrl(url: string): string {
  return url.replace('/watch?v=', '/embed/').replace('/shorts/', '/embed/').replace('youtu.be/', 'youtube.com/embed/');
}

const VideoDialog = ({ queryParam, videoUrl, onCancel }: IVideoDialogProps) => {
  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam) === '1';
  const [mounted, setMounted] = useState(false);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const embedUrl = toEmbedUrl(videoUrl);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showDialog) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancelRef.current();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [showDialog]);

  if (!showDialog || !mounted) {
    return null;
  }

  return createPortal(
    <div className={cn('fixed inset-0 overflow-y-auto', VIDEO_DIALOG_Z)} role="presentation">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden />
      <div
        className={cn(
          'relative flex min-h-full w-full items-center justify-center',
          'p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6',
        )}
        onClick={() => onCancelRef.current()}
      >
        <div
          className="flex w-[min(100%,64rem,calc((100dvh-7rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))*16/9))] max-w-5xl flex-col gap-3"
          role="dialog"
          aria-modal
          aria-label="Video"
          onClick={event => event.stopPropagation()}
        >
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
            <div className="aspect-video w-full">
              {embedUrl && (
                <iframe
                  className="h-full w-full border-0"
                  src={embedUrl}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <ActionButton action={Action.CANCEL} onClick={() => onCancelRef.current()} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default VideoDialog;
