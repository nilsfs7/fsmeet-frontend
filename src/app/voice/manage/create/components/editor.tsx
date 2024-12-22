'use client';

import { EditorMode } from '@/domain/enums/editor-mode';
import { toast } from 'sonner';
import { Poll } from '@/types/poll';
import PollEditor from '@/components/PollEditor';

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
