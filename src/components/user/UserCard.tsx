import { User } from '@/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { getUserTypeImages } from '@/functions/user-type';
import Link from 'next/link';

interface IUserCardProps {
  user: User;
  showUserTypeImage?: boolean;
  registrationStatus?: EventRegistrationStatus;
}

const UserCard = ({ user, showUserTypeImage = false, registrationStatus }: IUserCardProps) => {
  const name = user.lastName ? `${user.firstName} ${user.lastName}` : `${user.firstName}`;

  return (
    <Link href={`${routeUsers}/${user.username}`}>
      <div className={'w-max rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
        <div className="grid grid-flow-col items-center">
          <img src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} className="mx-1 h-6 w-6 rounded-full object-cover" />

          <div className="mx-1">{name}</div>

          {showUserTypeImage && <img src={getUserTypeImages(user.type).path} className="mx-1 h-6 w-6 rounded-full object-cover" />}

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
