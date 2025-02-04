'use client';

import Dialog from '@/components/Dialog';
import { routeRoadmap } from '@/domain/constants/routes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { imgAbout } from '@/domain/constants/images';
import { TaskSize } from '@/domain/enums/task-size';
import Separator from '@/components/Seperator';

interface ITask {
  title: string;
  size: TaskSize;
  filled: number;
  description?: string;
}

function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const Task = ({ title, size, filled, description }: ITask) => {
  const router = useRouter();

  const [id] = useState<number>(getRandomInteger(0, 999999));

  const handleTaskClicked = async () => {
    if (description) router.replace(`${routeRoadmap}?task-${id}=1`);
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeRoadmap}`);
  };

  return (
    <>
      <Dialog title={title} queryParam={`task-${id}`} onCancel={handleCancelDialogClicked}>
        <div>{`Task size: ${TaskSize[size].toLowerCase()}`}</div>
        <div className="my-2">{`Progress: ${filled}%`}</div>
        <Separator />
        <TextareaAutosize readOnly className="w-full resize-none overflow-hidden outline-none mt-2" value={description} />
      </Dialog>

      <div className={`h-20 w-${size} flex flex-col text-center align-bottom justify-end ${description && 'hover:cursor-pointer'}`} onClick={handleTaskClicked}>
        <div className={`h-full w-${size} flex items-end justify-center p-1 text-primary text-xs`}>
          {title}

          {description && <img src={imgAbout} className="mx-1 h-4 w-4 rounded-full object-cover" />}
        </div>
        <div className={`h-8 flex border border-primary`}>
          <div className={`h-full ${filled === 100 ? 'bg-success' : 'bg-secondary-dark'}`} style={{ width: `${filled}%` }} />
          <div className={`h-full w-full bg-secondary-light`} style={{ width: `${100 - filled}%` }} />
        </div>
      </div>
    </>
  );
};
