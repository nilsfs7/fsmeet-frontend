import ActionButton from '@/components/common/action-button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import Link from 'next/link';

interface IReplyContextProps {
  elementId: string;
  username: string;
  userProfileImageUrl?: string;
  onMessageChange: (message: string) => void;
  onSendReplyClick: () => void;
}

const PostInput = ({ elementId, username, userProfileImageUrl, onMessageChange, onSendReplyClick }: IReplyContextProps) => {
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
        <Input
          id={elementId}
          className={cn('h-8 w-full', 'bg-background')}
          maxLength={255}
          onChange={handleChange}
        />
      </div>

      <ActionButton action={Action.SEND} size={Size.S} onClick={onSendReplyClick} />
    </div>
  );
};

export default PostInput;
