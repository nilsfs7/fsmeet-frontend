import { User } from '@/types/user';
import ParticipantBadge from './ParticipantBadge';
import Link from 'next/link';
import { EventRegistrationStatus } from '@/types/enums/event-registration-status';
import { routeUsers } from '@/types/consts/routes';

interface IParticipantListProps {
  participants: User[];
  registrationStatus?: EventRegistrationStatus[];
}

const ParticipantList = ({ participants, registrationStatus }: IParticipantListProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
      <div className="text-base font-bold">{`Participants`}</div>
      <div className="flex flex-wrap">
        {participants.map((participant, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === participants.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-1 ${margin}`}>
              <Link href={`${routeUsers}/${participant.username}`}>
                {registrationStatus && <ParticipantBadge participant={participant} registrationStatus={registrationStatus[i]} />}
                {!registrationStatus && <ParticipantBadge participant={participant} />}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantList;
