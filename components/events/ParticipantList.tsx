import { IParticipant } from '@/interface/participant';
import Participant from './Participant';

interface IParticipantListProps {
  participants: IParticipant[];
}

const ParticipantList = ({ participants }: IParticipantListProps) => {
  return (
    <div className={'rounded-lg border-2 border-black bg-zinc-300 p-2 text-sm'}>
      <div className="text-base font-bold">Participants</div>
      <div className="flex flex-wrap">
        {participants.map((participant, i) => {
          return (
            <div key={i} className="m-1">
              <Participant participant={participant} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantList;
