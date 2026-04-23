'use client';

import { EditorMode } from '@/domain/enums/editor-mode';
import { toast } from 'sonner';
import PollEditor from '@/components/poll-editor';
import { TargetGroup } from '@/domain/types/target-group';

export const Editor = () => {
  const cachePollInfo = async (pollInfo: { question: string; description: string; options: string[]; deadline: string | null; targetGroup: TargetGroup }) => {
    try {
      sessionStorage.setItem('pollInfo', JSON.stringify(pollInfo));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <PollEditor
      editorMode={EditorMode.CREATE}
      onPollUpdate={(pollInfo: { question: string; description: string; options: string[]; deadline: string | null; targetGroup: TargetGroup }) => {
        cachePollInfo(pollInfo);
      }}
    />
  );
};
