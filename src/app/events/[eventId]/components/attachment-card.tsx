import { Attachment } from '@/domain/types/attachment';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface IAttachmentCardProps {
  attachment: Attachment;
}

const AttachmentCard = ({ attachment }: IAttachmentCardProps) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={attachment.url || ''}>
      <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
        <div className="grid grid-flow-col items-center justify-between">
          <div className="flex items-center mx-1">{attachment.name}</div>

          {attachment.isExternal ? <OpenInNewIcon /> : <FilePresentIcon />}
        </div>
      </div>
    </a>
  );
};

export default AttachmentCard;
