import { User } from '@/types/user';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import { imgUserDefaultImg } from '@/domain/constants/images';

interface IParticipantBadgeProps {
  participant: User;
  registrationStatus?: EventRegistrationStatus;
}

const ParticipantBadge = ({ participant, registrationStatus }: IParticipantBadgeProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
      <div className="grid grid-flow-col items-center justify-between">
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
  );
};

export default ParticipantBadge;
