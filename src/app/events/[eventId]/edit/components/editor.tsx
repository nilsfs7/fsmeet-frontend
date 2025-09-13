'use client';

import { Event } from '@/domain/types/event';
import EventEditor from '@/components/events/event-editor';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import { fileToBase64 } from '@/functions/file-to-base-64';
import { User } from '@/domain/types/user';

interface IEditor {
  users: User[];
  event?: Event;
}

export const Editor = ({ users, event }: IEditor) => {
  const cacheEventInfo = async (event: Event) => {
    try {
      sessionStorage.setItem('eventInfo', JSON.stringify(event));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const cacheEventPoster = async (imgEventPoster: File) => {
    try {
      const base64String = await fileToBase64(imgEventPoster);
      sessionStorage.setItem('imgEventPoster', base64String);
    } catch (error: any) {
      if (error.toString().toLowerCase().includes('exceeded the quota')) {
        toast.error('File too big for browser storage.');
      } else {
        toast.error(error.message);
      }
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <EventEditor
        editorMode={EditorMode.EDIT}
        users={users}
        event={event}
        onEventUpdate={(event: Event) => {
          cacheEventInfo(event);
        }}
        onEventPosterUpdate={(image: File) => {
          cacheEventPoster(image);
        }}
      />
    </>
  );
};
