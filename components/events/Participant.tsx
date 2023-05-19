import { IParticipant } from '@/interface/participant';

interface IParticipantProps {
  participant: IParticipant;
}

const defaultImg = '/profile/user.png';

const Participant = ({ participant }: IParticipantProps) => {
  return (
    <div className={'rounded-lg border-2 border-black bg-zinc-300 p-2 hover:bg-zinc-400'}>
      <div className="grid grid-flow-col items-center justify-start">
        <div>{participant.name}</div>
        <img src={participant.imageUrl ? participant.imageUrl : defaultImg} className="mx-2 h-6 w-6 rounded-full object-cover" />
      </div>

      <div>
        {participant.instagramHandle && (
          <a className="text-xs underline" href={`https://www.instagram.com/${participant.instagramHandle.replace('@', '')}`}>
            {participant.instagramHandle}
          </a>
        )}
      </div>
    </div>
  );
};

export default Participant;
