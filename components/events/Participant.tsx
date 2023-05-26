import { User } from '@/types/user';

interface IParticipantProps {
  participant: User;
}

const defaultImg = '/profile/user.png';

const Participant = ({ participant }: IParticipantProps) => {
  return (
    <div className={'rounded-lg border-2 border-black bg-zinc-300 p-2 hover:bg-zinc-400'}>
      <div className="grid grid-flow-col items-center justify-start">
        <img src={participant.imageUrl ? participant.imageUrl : defaultImg} className="mx-2 h-6 w-6 rounded-full object-cover" />
        <div>{participant.username}</div>
      </div>
    </div>
  );
};

export default Participant;
