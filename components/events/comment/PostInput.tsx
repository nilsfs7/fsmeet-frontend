import ActionButton from '@/components/common/ActionButton';
import { imgUserDefaultImg } from '@/types/consts/images';
import { Action } from '@/types/enums/action';
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
          <Link href={`/user/${username}`}>
            <img src={userProfileImageUrl ? userProfileImageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-zinc-200 object-cover" />
          </Link>
        </div>
      </div>

      <div className="mx-1 w-full">
        <input id={elementId} className="h-full w-full rounded-lg bg-zinc-100 p-1 text-sm " onChange={handleChange} />
      </div>

      <div className="mx-1">
        <ActionButton action={Action.SEND} onClick={onSendReplyClick} />
      </div>
    </div>
  );
};

export default PostInput;
