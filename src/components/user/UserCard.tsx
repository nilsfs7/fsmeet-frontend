import { User } from '@/domain/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
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
  let name: string = user.username; // Defauts to username. Guarantees there is at least some name on the UserCard.

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
                countryCode={user.country || ''}
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
              {registrationStatus == EventRegistrationStatus.APPROVED && <CheckIcon />}
              {registrationStatus == EventRegistrationStatus.PENDING && <HourglassTopIcon />}
              {registrationStatus == EventRegistrationStatus.DENIED && <BlockIcon />}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
