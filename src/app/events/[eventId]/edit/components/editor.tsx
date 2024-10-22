'use client';

import { Event } from '@/types/event';
import EventEditor from '@/components/events/EventEditor';
import { EditorMode } from '@/domain/enums/editor-mode';
import { toast, Toaster } from 'sonner';

interface IEditor {
  event?: Event;
}

export const Editor = ({ event }: IEditor) => {
  const cacheEventInfo = async (event: Event) => {
    try {
      sessionStorage.setItem('eventInfo', JSON.stringify(event));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <EventEditor
        editorMode={EditorMode.EDIT}
        event={event}
        onEventUpdate={(event: Event) => {
          cacheEventInfo(event);
        }}
      />
    </>
  );
};
