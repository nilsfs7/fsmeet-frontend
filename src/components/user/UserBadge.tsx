import { User } from '@/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';

interface IUserBadgeProps {
  participant: User;
  registrationStatus?: EventRegistrationStatus;
}

const UserBadge = ({ participant, registrationStatus }: IUserBadgeProps) => {
  return (
    <Link href={`${routeUsers}/${participant.username}`}>
      <div className={'w-max rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
        <div className="grid grid-flow-col items-center">
          <img src={participant.imageUrl ? participant.imageUrl : imgUserDefaultImg} className="mx-1 h-6 w-6 rounded-full object-cover" />
          <div className="mx-1">{participant.username}</div>
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

export default UserBadge;
