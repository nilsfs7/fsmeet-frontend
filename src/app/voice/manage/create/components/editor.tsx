'use client';

import { EditorMode } from '@/domain/enums/editor-mode';
import { toast } from 'sonner';
import { Poll } from '@/domain/types/poll';
import PollEditor from '@/components/poll-editor';

export const Editor = () => {
  const cachePollInfo = async (event: Poll) => {
    try {
      sessionStorage.setItem('pollInfo', JSON.stringify(event));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <PollEditor
      editorMode={EditorMode.CREATE}
      onPollUpdate={(poll: Poll) => {
        cachePollInfo(poll);
      }}
    />
  );
};
