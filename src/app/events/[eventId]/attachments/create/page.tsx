'use client';

import TextButton from '@/components/common/text-button';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { Attachment } from '@/domain/types/attachment';
import AttachmentEditor from '@/components/events/attachment-editor';
import NavigateBackButton from '@/components/navigate-back-button';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { createAttachment, updateAttachmentFile } from '@/infrastructure/clients/attachment.client';

export default function CreateEventAttachment(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/attachments/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [attachment, setAttachment] = useState<Attachment>();
  const [attachmentFile, setAttachmentFile] = useState<File>();

  const handleCreateClicked = async () => {
    if (attachment) {
      try {
        const res = await createAttachment(params.eventId, attachment.name, attachment.isExternal, attachment.url, attachment.expires, attachment.expiryDate, attachment.enabled, session);
        if (attachmentFile) {
          await updateAttachmentFile(res.id, attachmentFile, session);
        }

        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/attachments`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <AttachmentEditor
            onAttachmentUpdate={(attachment: Attachment) => {
              setAttachment(attachment);
            }}
            onAttachmentFileUpdate={async (file: File) => {
              setAttachmentFile(file);
            }}
          />
        </div>

        <Navigation>
          <NavigateBackButton />
          <TextButton text={t('btnCreate')} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
}
