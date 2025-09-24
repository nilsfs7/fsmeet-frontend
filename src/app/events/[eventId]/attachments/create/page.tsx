'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Attachment } from '@/domain/types/attachment';
import AttachmentEditor from '@/components/events/attachment-editor';
import NavigateBackButton from '@/components/NavigateBackButton';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { createAttachment } from '@/infrastructure/clients/attachment.client';
import { fileToBase64 } from '@/functions/file-to-base-64';

export default function CreateEventAttachment(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/attachments/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [attachment, setAttachment] = useState<Attachment>();
  const [attachmentDocument, setAttachmentDocument] = useState<string>();

  const handleCreateClicked = async () => {
    if (attachment) {
      try {
        await createAttachment(
          params.eventId,
          attachment.name,
          attachment.isExternal,
          attachment.url,
          attachmentDocument || null,
          attachment.expires,
          attachment.expiryDate,
          attachment.enabled,
          session
        );

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
            onAttachmentDocumentUpdate={async (file: File) => {
              const base64String = await fileToBase64(file);
              setAttachmentDocument(base64String);
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
