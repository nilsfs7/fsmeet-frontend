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
    <div className="flex w-full min-w-0 max-w-full items-center gap-2 text-sm">
      <div className="h-8 w-8 shrink-0">
        <Link href={`${routeUsers}/${username}`} className="block h-full w-full">
          <img src={userProfileImageUrl ? userProfileImageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-background object-cover" />
        </Link>
      </div>

      <div className="min-w-0 flex-1">
        <Input
          id={elementId}
          className={cn('h-8 w-full min-w-0', 'bg-background')}
          maxLength={255}
          onChange={handleChange}
        />
      </div>

      <div className="shrink-0">
        <ActionButton action={Action.SEND} size={Size.S} onClick={onSendReplyClick} />
      </div>
    </div>
  );
};

export default PostInput;
