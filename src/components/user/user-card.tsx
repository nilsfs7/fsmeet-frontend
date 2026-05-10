import { User } from '@/domain/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { IconBan, IconCheck, IconHourglass } from '@tabler/icons-react';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { cn } from '@/lib/utils';

interface IUserCardProps {
  user: User;
  showName?: boolean;
  showFirstNameOnly?: boolean;
  showUserCountryFlag?: boolean;
  registrationStatus?: EventRegistrationStatus;
}

const cardSurface = cn(
  'group min-w-0 max-w-lg overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'transition-all duration-200',
  'hover:border-primary/50 hover:shadow-md',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
);

const UserCard = ({ user, showName = true, showFirstNameOnly = false, showUserCountryFlag = false, registrationStatus }: IUserCardProps) => {
  let name: string = user.username;

  if (user.firstName && user.lastName) {
    name = `${user.firstName} ${user.lastName}`;
  }

  if (showFirstNameOnly || (user.firstName && !user.lastName)) {
    name = `${user.firstName}`;
  }

  return (
    <Link
      href={`${routeUsers}/${user.username}`}
      className={cn(
        'inline-block max-w-full align-middle no-underline',
        'rounded-xl outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <div className={cardSurface}>
        <div className={cn('flex min-w-0 items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3', !showName && !registrationStatus && 'px-2.5 py-2 sm:px-3 sm:py-2.5')}>
          {showUserCountryFlag ? (
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <ReactCountryFlag
                className="!h-full !w-full"
                countryCode={user.countryCode || ''}
                svg
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : (
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <img src={user.imageUrl || imgUserDefaultImg} className="h-full w-full object-cover" alt="" />
            </div>
          )}

          {showName && <span className="type-body-sm min-w-0 flex-1 font-medium leading-snug text-foreground">{name}</span>}

          {registrationStatus && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center">
              {registrationStatus === EventRegistrationStatus.APPROVED && <IconCheck className="h-4 w-4 text-success" stroke={2} aria-hidden />}
              {registrationStatus === EventRegistrationStatus.PENDING && <IconHourglass className="h-4 w-4 text-amber-600 dark:text-amber-400" stroke={2} aria-hidden />}
              {registrationStatus === EventRegistrationStatus.DENIED && <IconBan className="h-4 w-4 text-destructive" stroke={2} aria-hidden />}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
