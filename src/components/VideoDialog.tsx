'use client';

import { useSearchParams } from 'next/navigation';
import ActionButton from './common/ActionButton';
import { Action } from '@/domain/enums/action';

interface IVideoDialogProps {
  queryParam: string;
  videoUrl: string;
  onCancel: () => void;
  onConfirm?: () => void;
}

const VideoDialog = ({ queryParam, videoUrl, onCancel }: IVideoDialogProps) => {
  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);

  const clickCancel = () => {
    onCancel && onCancel();
  };

  // convert YouTube URLs
  videoUrl = videoUrl.replace('/watch?v=', '/embed/');
  videoUrl = videoUrl.replace('/shorts/', '/embed/');
  videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');

  return showDialog === '1' ? (
    <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-primary bg-opacity-50 z-50">
      <div className="p-2 w-full h-full max-w-[95%] max-h-[90%] flex flex-col gap-2 rounded-lg bg-background">
        <iframe className="w-full h-full rounded-lg" src={videoUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />

        <div className="flex flex-row justify-between">
          <ActionButton action={Action.CANCEL} onClick={clickCancel} />
        </div>
      </div>
    </div>
  ) : null;
};

export default VideoDialog;
