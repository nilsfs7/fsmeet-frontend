import { imgUserDefaultImg } from '@/types/consts/images';
import { EventComment } from '@/types/event-comment';
import { formatTs } from '@/types/funcs/time';
import Link from 'next/link';

interface ICommentProps {
  comment: EventComment;
  onClickReply: (commentId: string) => void;
}

const UserComment = ({ comment, onClickReply }: ICommentProps) => {
  const clickReply = (commentId: string) => {
    onClickReply(commentId);
  };

  return (
    <>
      <div className="grid grid-flow-col justify-start">
        <div className="ml-1">
          <div className="h-8 w-8">
            <Link href={`/user/${comment.user.username}`}>
              <img src={comment.user.imageUrl ? comment.user.imageUrl : imgUserDefaultImg} className="rounded-full bg-zinc-200 object-cover" />
            </Link>
          </div>
        </div>

        <div className="mx-1">
          <div className="rounded-lg bg-zinc-200 px-2 py-1">
            <Link href={`/user/${comment.user.username}`}>
              <div className="w-max text-base font-bold">{comment.user.username}</div>
            </Link>

            <div className="mt-1 text-sm">{comment.message}</div>
          </div>

          <div className="mt-1 flex items-center text-xs">
            {/* timestamp */}
            <div className="mx-1 ">{`${formatTs(comment.timestamp, 'DD.MM HH:mm')}`}</div>

            {/* reply */}
            <button
              className="mx-1 hover:underline"
              onClick={() => {
                clickReply(comment.id);
              }}
            >
              {`Reply`}
            </button>

            {/* upvotes */}
            {/* <div className="mx-1 flex items-center">
              <div className="">6</div>
              <IconButton size="small" className="sm hover:bg-transparent">
                <ThumbUpIcon fontSize="inherit" className="text-black" />
              </IconButton>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserComment;
