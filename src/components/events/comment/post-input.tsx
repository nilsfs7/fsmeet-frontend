import { IconLoader2, IconSend } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';

interface IReplyContextProps {
  elementId: string;
  username: string;
  userProfileImageUrl?: string;
  /** Controlled value so the text can be cleared on success and kept on failure. */
  value: string;
  /** While true the input and send button are disabled and the button shows a spinner. */
  posting?: boolean;
  sendLabel?: string;
  onMessageChange: (message: string) => void;
  onSendReplyClick: () => void;
}

/** Same surface as `ActionButton` so the send button looks unchanged. */
const sendButtonSurface = cn(
  'border border-border/60 bg-secondary-light/85 shadow-xs backdrop-blur-xs supports-backdrop-filter:bg-secondary-light/70 transition-all duration-200',
  'hover:border-primary/50 hover:shadow-md hover:scale-100 active:scale-100',
  'dark:border-border/50 dark:bg-background/60 dark:supports-backdrop-filter:bg-background/50 dark:hover:border-primary/40',
);

const PostInput = ({ elementId, username, userProfileImageUrl, value, posting = false, sendLabel, onMessageChange, onSendReplyClick }: IReplyContextProps) => {
  const canSend = !posting && value.trim().length > 0;

  return (
    <form
      className="flex w-full min-w-0 max-w-full items-center gap-2 text-sm"
      onSubmit={e => {
        e.preventDefault();
        if (canSend) onSendReplyClick();
      }}
    >
      <div className="h-8 w-8 shrink-0">
        <Link href={`${routeUsers}/${username}`} className="block h-full w-full">
          <img src={userProfileImageUrl ? userProfileImageUrl : imgUserDefaultImg} alt={username} className="h-full w-full rounded-full bg-background object-cover" />
        </Link>
      </div>

      <div className="min-w-0 flex-1">
        <Input
          id={elementId}
          className={cn('h-8 w-full min-w-0', 'bg-background')}
          maxLength={255}
          value={value}
          disabled={posting}
          onChange={e => onMessageChange(e.target.value)}
        />
      </div>

      <div className="shrink-0">
        <Button type="submit" variant="actionIcon" size="iconSm" className={sendButtonSurface} disabled={!canSend} aria-label={sendLabel} aria-busy={posting} data-testid={`${elementId}-send`}>
          {posting ? <IconLoader2 className="h-[63%] w-[63%] animate-spin" stroke={2} aria-hidden /> : <IconSend className="h-[63%] w-[63%]" stroke={2} aria-hidden />}
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
