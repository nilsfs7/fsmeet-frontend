'use client';

import { Attachment } from '@/domain/types/attachment';
import AttachmentCard from './attachment-card';
import { useTranslations } from 'next-intl';
import moment from 'moment';

interface IAttachmentSectionProps {
  eventAttachments: Attachment[];
}

function compareAttachmentIndex(a: Attachment, b: Attachment): number {
  if (a.index == null && b.index == null) return 0;
  if (a.index == null) return 1;
  if (b.index == null) return -1;
  return a.index - b.index;
}

export const AttachmentSection = ({ eventAttachments }: IAttachmentSectionProps) => {
  const t = useTranslations('/events/eventid');
  const orderedAttachments = [...eventAttachments].sort(compareAttachmentIndex);

  if (
    !eventAttachments.some(attachment => {
      if (attachment.enabled) return attachment;
    })
  ) {
    return <></>;
  }

  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2'}>
      <div className="text-base font-bold">{t('tabOverviewSectionAttachments')}</div>

      <div className="mt-1 flex flex-wrap gap-2">
        {orderedAttachments
          .filter(att => {
            if (att.enabled && att.url) {
              if (!att.expires || (att.expires && moment(att.expiryDate) > moment())) {
                return att;
              }
            }
          })
          .map((attachment, i) => {
            return <AttachmentCard key={i} attachment={attachment} />;
          })}
      </div>
    </div>
  );
};
