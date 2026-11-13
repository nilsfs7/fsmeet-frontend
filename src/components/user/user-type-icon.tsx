import {
  IconBallFootball,
  IconBuildingCommunity,
  IconCalendarStar,
  IconHeadphones,
  IconHeart,
  IconMicrophone2,
  IconShieldCheck,
  IconTag,
  IconUser,
  IconVideo,
  type Icon,
} from '@tabler/icons-react';
import { UserType } from '@/domain/enums/user-type';
import { cn } from '@/lib/utils';

const USER_TYPE_ICON: Record<UserType, { Icon: Icon; tone: string }> = {
  [UserType.FREESTYLER]: { Icon: IconBallFootball, tone: 'bg-brand-soft text-brand-strong' },
  [UserType.ASSOCIATION]: { Icon: IconBuildingCommunity, tone: 'bg-sky-50 text-sky-700' },
  [UserType.BRAND]: { Icon: IconTag, tone: 'bg-violet-50 text-violet-700' },
  [UserType.DJ]: { Icon: IconHeadphones, tone: 'bg-fuchsia-50 text-fuchsia-700' },
  [UserType.EVENT_ORGANIZER]: { Icon: IconCalendarStar, tone: 'bg-amber-50 text-amber-700' },
  [UserType.FAN]: { Icon: IconHeart, tone: 'bg-rose-50 text-rose-700' },
  [UserType.MC]: { Icon: IconMicrophone2, tone: 'bg-orange-50 text-orange-700' },
  [UserType.MEDIA]: { Icon: IconVideo, tone: 'bg-indigo-50 text-indigo-700' },
  [UserType.ADMINISTRATIVE]: { Icon: IconShieldCheck, tone: 'bg-neutral-100 text-neutral-700' },
};

export function getUserTypeIcon(userType: UserType | undefined): { Icon: Icon; tone: string } {
  return (userType && USER_TYPE_ICON[userType]) || { Icon: IconUser, tone: 'bg-muted text-muted-foreground' };
}

interface IUserTypeIcon {
  userType: UserType | undefined;
  /** `plain`: bare glyph (inline with text); `tile`: tinted rounded square. */
  variant?: 'plain' | 'tile';
  className?: string;
  title?: string;
}

/** Consistent Tabler icon for a user type (replaces the legacy clip-art SVGs in lists and profile chips). */
export function UserTypeIcon({ userType, variant = 'plain', className, title }: IUserTypeIcon) {
  const { Icon, tone } = getUserTypeIcon(userType);
  if (variant === 'tile') {
    return (
      <span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', tone, className)} title={title}>
        <Icon className="h-[18px] w-[18px]" stroke={1.75} aria-hidden />
      </span>
    );
  }
  return <Icon className={cn('h-4 w-4 shrink-0', className)} stroke={1.75} aria-hidden />;
}
