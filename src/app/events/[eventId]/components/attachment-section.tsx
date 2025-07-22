'use client';

import { Attachment } from '@/domain/types/attachment';
import AttachmentCard from './attachment-card';
import { useTranslations } from 'next-intl';
import moment from 'moment';

interface IAttachmentSectionProps {
  eventAttachments: Attachment[];
}

export const AttachmentSection = ({ eventAttachments }: IAttachmentSectionProps) => {
  const t = useTranslations('/events/eventid');

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
        {eventAttachments
          .filter(att => {
            if (att.enabled) {
              if (!att.expires || (att.expires && moment(att.expiryDate) > moment())) {
                return att;
              }
            }
          })
          .map((attachment, i) => {
            if (attachment.enabled) {
              return <AttachmentCard key={i} attachment={attachment} />;
            }
          })}
      </div>
    </div>
  );
};
