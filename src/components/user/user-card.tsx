import { User } from '@/domain/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { IconBan, IconCheck, IconHourglass } from '@tabler/icons-react';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';

interface IUserCardProps {
  user: User;
  showName?: boolean;
  showFirstNameOnly?: boolean;
  showUserCountryFlag?: boolean;
  registrationStatus?: EventRegistrationStatus;
}

const UserCard = ({ user, showName = true, showFirstNameOnly = false, showUserCountryFlag = false, registrationStatus }: IUserCardProps) => {
  let name: string = user.username; // Defaults to username. Guarantees there is at least some name on the UserCard.

  // Ideally show first name and last name.
  if (user.firstName && user.lastName) {
    name = `${user.firstName} ${user.lastName}`;
  }

  // Show first name only if last name does not exist.
  if (showFirstNameOnly || (user.firstName && !user.lastName)) {
    name = `${user.firstName}`;
  }

  return (
    <Link href={`${routeUsers}/${user.username}`}>
      <div className={'w-max rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
        <div className="grid grid-flow-col items-center">
          {showUserCountryFlag ? (
            <div className="mx-1 h-6 w-6">
              <ReactCountryFlag
                className="w-full h-full"
                countryCode={user.countryCode || ''}
                svg
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : (
            <img src={user.imageUrl || imgUserDefaultImg} className="mx-1 h-6 w-6 rounded-full object-cover" />
          )}

          {showName && <div className="mx-1">{name}</div>}

          {registrationStatus && (
            <>
              {registrationStatus == EventRegistrationStatus.APPROVED && <IconCheck className="h-4 w-4" stroke={2.0} />}
              {registrationStatus == EventRegistrationStatus.PENDING && <IconHourglass className="h-4 w-4" stroke={2.0} />}
              {registrationStatus == EventRegistrationStatus.DENIED && <IconBan className="h-4 w-4" stroke={2.0} />}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
