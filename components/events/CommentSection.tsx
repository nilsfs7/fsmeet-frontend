import { EventComment } from '@/types/event-comment';
import UserComment from './EventComment';

interface ICommentSectionProps {
  eventComments: EventComment[];
}

const CommentSection = ({ eventComments }: ICommentSectionProps) => {
  return (
    <div className={'rounded-lg border border-black bg-zinc-300 p-2 text-sm'}>
      <div className="text-base font-bold">Comments</div>
      <div className="flex flex-col flex-wrap">
        {eventComments.map((comment: EventComment, i) => {
          return (
            <div key={i} className={`mt-1 flex`}>
              <UserComment comment={comment} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
