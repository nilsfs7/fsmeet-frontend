import { User } from '@/types/user';
import { EventRegistrationStatus } from '@/types/enums/event-registration-status';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import { imgUserDefaultImg } from '@/types/consts/images';

interface IParticipantProps {
  participant: User;
  registrationStatus: EventRegistrationStatus;
}

const Participant = ({ participant, registrationStatus }: IParticipantProps) => {
  return (
    <div className={'rounded-lg border border-black bg-primary-light p-2 hover:bg-primary'}>
      <div className="grid grid-flow-col items-center justify-between">
        <img src={participant.imageUrl ? participant.imageUrl : imgUserDefaultImg} className="mx-1 h-6 w-6 rounded-full object-cover" />
        <div className="mx-1">{participant.username}</div>
        <>
          {registrationStatus == EventRegistrationStatus.APPROVED && <CheckIcon />}
          {registrationStatus == EventRegistrationStatus.PENDING && <HourglassTopIcon />}
          {registrationStatus == EventRegistrationStatus.DENIED && <BlockIcon />}
        </>
      </div>
    </div>
  );
};

export default Participant;
