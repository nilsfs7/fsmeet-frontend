'use client';

import TextButton from '@/components/common/text-button';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { Attachment } from '@/domain/types/attachment';
import { deleteAttachment, getAttachment, updateAttachment } from '@/infrastructure/clients/attachment.client';
import AttachmentEditor from '@/components/events/attachment-editor';
import Dialog from '@/components/dialog';
import NavigateBackButton from '@/components/navigate-back-button';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { fileToBase64 } from '@/functions/file-to-base-64';
import { useTranslations } from 'next-intl';

export default function EditEventAttachment(props: { params: Promise<{ eventId: string; attachmentId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/attachments/attachmentid/edit');
  const { data: session, status } = useSession();

  const router = useRouter();

  const [attachment, setAttachment] = useState<Attachment>();
  const [attachmentDocument, setAttachmentDocument] = useState<string>();

  const handleSaveClicked = async () => {
    if (attachment) {
      try {
        await updateAttachment(
          params.attachmentId,
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

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/attachments/${params.attachmentId}/edit?delete=1`);
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/attachments/${params.attachmentId}/edit`);
  };

  const handleConfirmDeleteClicked = async () => {
    if (attachment) {
      try {
        await deleteAttachment(params.attachmentId, session);
        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/attachments`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getAttachment(params.attachmentId).then(attachment => {
      setAttachment(attachment);
    });
  }, [attachment === undefined]);

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgDeleteDocumentTitle')} queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{t('dlgDeleteDocumentText')}</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <AttachmentEditor
            attachment={attachment}
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

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <TextButton text={t('btnSave')} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
