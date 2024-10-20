'use client';

import { Event } from '@/types/event';
import EventEditor from '@/components/events/EventEditor';
import { EditorMode } from '@/domain/enums/editor-mode';
import { toast } from 'sonner';

export const Editor = () => {
  const cacheEventInfo = async (event: Event) => {
    try {
      sessionStorage.setItem('eventInfo', JSON.stringify(event));
    } catch (error: any) {
      toast.error('error.message');
      console.error('error.message');
    }
  };

  return (
    <EventEditor
      editorMode={EditorMode.CREATE}
      onEventUpdate={(event: Event) => {
        cacheEventInfo(event);
      }}
    />
  );
};
