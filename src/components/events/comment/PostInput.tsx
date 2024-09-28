import ActionButton from '@/components/common/ActionButton';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
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
    <div className="mt-1 flex">
      <div className="ml-1">
        <div className="h-8 w-8">
          <Link href={`${routeUsers}/${username}`}>
            <img src={userProfileImageUrl ? userProfileImageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-zinc-200 object-cover" />
          </Link>
        </div>
      </div>

      <div className="mx-1 w-full">
        <input id={elementId} className="h-full w-full rounded-lg border border-secondary-dark bg-background p-1 text-sm hover:border-primary" maxLength={255} onChange={handleChange} />
      </div>

      <div className="mx-1">
        <ActionButton action={Action.SEND} onClick={onSendReplyClick} />
      </div>
    </div>
  );
};

export default PostInput;
