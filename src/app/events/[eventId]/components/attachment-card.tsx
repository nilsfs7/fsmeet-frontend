import { Attachment } from '@/domain/types/attachment';
import { IconExternalLink, IconFile } from '@tabler/icons-react';

interface IAttachmentCardProps {
  attachment: Attachment;
}

const AttachmentCard = ({ attachment }: IAttachmentCardProps) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={attachment.url || ''}>
      <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
        <div className="grid grid-flow-col items-center justify-between">
          <div className="flex items-center mx-1">{attachment.name}</div>

          {attachment.isExternal ? <IconExternalLink className="h-4 w-4" stroke={2.0} /> : <IconFile className="h-4 w-4" stroke={2.0} />}
        </div>
      </div>
    </a>
  );
};

export default AttachmentCard;
