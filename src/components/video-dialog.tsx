'use client';

/**
 * URL query–driven video dialog (e.g. `?trailer=1`).
 * Uses the shared Radix dialog so overlay, motion, and chrome match every other dialog.
 */
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const open = searchParams?.get(queryParam) === '1';
  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="w-[min(calc(100%-2rem-env(safe-area-inset-left,0px)-env(safe-area-inset-right,0px)),64rem,calc((100dvh-7rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))*16/9))] max-w-none pt-10"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Video</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden rounded-lg bg-black">
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
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
