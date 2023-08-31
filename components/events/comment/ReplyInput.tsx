import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';

interface IReplyConextProps {
  onMessageChange: (message: string) => void;
  onSendReplyClick: () => void;
}

const ReplyContext = ({ onMessageChange, onSendReplyClick }: IReplyConextProps) => {
  const handleChange = (event: any) => {
    onMessageChange(event.target.value);
  };

  return (
    <div className={`mt-1 flex`}>
      {/* keep same space as image of root comment */}
      <div className="mx-1 mt-1 h-8 w-8" />

      <input id="replyInput" className="w-full rounded-lg bg-zinc-100 p-1 text-sm " onChange={handleChange} />
      <div className="mx-2 ">
        <ActionButton action={Action.SEND} onClick={onSendReplyClick} />
      </div>
    </div>
  );
};

export default ReplyContext;
