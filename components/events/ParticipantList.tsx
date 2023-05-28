import { User } from '@/types/user';
import Participant from './Participant';
import Link from 'next/link';

interface IParticipantListProps {
  participants: User[];
}

const ParticipantList = ({ participants }: IParticipantListProps) => {
  return (
    <div className={'rounded-lg border-2 border-black bg-zinc-300 p-2 text-sm'}>
      <div className="text-base font-bold">Participants</div>
      <div className="flex flex-wrap">
        {participants.map((participant, i) => {
          return (
            <div key={i} className="m-1 h-16 w-36">
              <Link href={`/user/${participant.username}`}>
                <Participant participant={participant} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantList;
