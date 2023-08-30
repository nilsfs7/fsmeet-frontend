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
      <div className="grid grid-flow-col justify-between p-2">
        <div className="">
          <Link href={`/user/${comment.username}`}>
            <img src={imgUserDefaultImg} className="mx-1 h-8 w-8 rounded-full bg-zinc-200 object-cover" />
          </Link>
        </div>
        <div className="">
          <div className="items-center justify-between rounded-lg bg-zinc-200 p-2">
            <Link href={`/user/${comment.username}`}>
              <div className="text-xs">{comment.username}</div>
            </Link>
            <div className="text-sm">{comment.message}</div>
          </div>
          <div className="mx-2 mt-1 text-xs">{`${formatTs(comment.timestamp, 'DD.MM HH:mm')}`}</div>
        </div>
      </div>
    </>
  );
};

export default UserComment;

// hover:bg-zinc-400
