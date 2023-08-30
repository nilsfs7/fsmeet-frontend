import { imgUserDefaultImg } from '@/types/consts/images';
import { EventComment } from '@/types/event-comment';

import { formatTs } from '@/types/funcs/time';
import Link from 'next/link';

interface ICommentProps {
  comment: EventComment;
}

const UserComment = ({ comment }: ICommentProps) => {
  return (
    <>
      <div className="m-1 grid grid-flow-col justify-between">
        <Link href={`/user/${comment.user.username}`}>
          <img src={comment.user.imageUrl ? comment.user.imageUrl : imgUserDefaultImg} className="mx-1 h-8 w-8 rounded-full bg-zinc-200 object-cover" />
        </Link>

        <div>
          <div className="rounded-lg bg-zinc-200 px-2 py-1">
            <Link href={`/user/${comment.user.username}`}>
              <div className="w-max text-base font-bold">{comment.user.username}</div>
            </Link>

            <div className="mt-1 text-sm">{comment.message}</div>
          </div>
          <div className="mx-2 mt-1 text-xs">{`${formatTs(comment.timestamp, 'DD.MM HH:mm')}`}</div>
        </div>
      </div>
    </>
  );
};

export default UserComment;

// hover:bg-zinc-400
