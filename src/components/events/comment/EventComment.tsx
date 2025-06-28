import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { EventComment } from '@/types/event-comment';
import { formatTs } from '@/functions/time';
import moment from 'moment';
import Link from 'next/link';

interface IUserCommentProps {
  comment: EventComment;
  onClickReply: (commentId: string) => void;
}

const UserComment = ({ comment, onClickReply }: IUserCommentProps) => {
  const clickReply = (commentId: string) => {
    onClickReply(commentId);
  };

  return (
    <>
      <div className="grid grid-flow-col gap-1 justify-start text-sm">
        <div className="h-8 w-8">
          <Link href={`${routeUsers}/${comment.user.username}`}>
            <img src={comment.user.imageUrl ? comment.user.imageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-background object-cover" />
          </Link>
        </div>

        <div className="flex flex-col gap-1 ">
          <div className="flex flex-col gap-1 rounded-lg bg-background p-1">
            <Link href={`${routeUsers}/${comment.user.username}`}>
              <div className="w-max font-bold">
                {comment.user.firstName} {comment.user.lastName}
              </div>
            </Link>

            <div>{comment.message}</div>
          </div>

          <div className="flex text-xs gap-1 px-1">
            {/* timestamp */}
            <div>{`${formatTs(moment(comment.timestamp), 'DD.MM HH:mm')}`}</div>

            {/* reply */}
            <button
              className="hover:underline"
              onClick={() => {
                clickReply(comment.id);
              }}
            >
              {`Reply`}
            </button>

            {/* upvotes */}
            {/* <div className="mx-1 flex items-center">
              <div>6</div>
              <IconButton size="small" className="sm hover:bg-transparent">
                <ThumbUpIcon fontSize="inherit" />
              </IconButton>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserComment;
