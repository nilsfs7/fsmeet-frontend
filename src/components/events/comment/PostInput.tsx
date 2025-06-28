import ActionButton from '@/components/common/ActionButton';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import Link from 'next/link';

interface IReplyConextProps {
  elementId: string;
  username: string;
  userProfileImageUrl?: string;
  onMessageChange: (message: string) => void;
  onSendReplyClick: () => void;
}

const PostInput = ({ elementId, username, userProfileImageUrl, onMessageChange, onSendReplyClick }: IReplyConextProps) => {
  const handleChange = (event: any) => {
    onMessageChange(event.target.value);
  };

  return (
    <div className="grid grid-flow-col gap-1 justify-start text-sm">
      <div className="h-8 w-8">
        <Link href={`${routeUsers}/${username}`}>
          <img src={userProfileImageUrl ? userProfileImageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-background object-cover" />
        </Link>
      </div>

      <div className="min-w-[50vw]">
        <input id={elementId} className="h-full w-full rounded-lg border border-secondary-dark bg-background p-1 text-sm hover:border-primary" maxLength={255} onChange={handleChange} />
      </div>

      <ActionButton action={Action.SEND} size={Size.S} onClick={onSendReplyClick} />
    </div>
  );
};

export default PostInput;
