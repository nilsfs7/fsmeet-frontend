'use client';

import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { EventComment } from '@/domain/types/event-comment';
import { formatTs } from '@/functions/time';
import moment from 'moment';
import Link from 'next/link';
import ActionButton from '../../common/action-button';
import { Action } from '../../../domain/enums/action';
import { Size } from '../../../domain/enums/size';
import { AdministrativeUser } from '../../../domain/enums/administrative-user';
import { useSession } from 'next-auth/react';

interface IUserCommentProps {
  comment: EventComment;
  onClickReply: (commentId: string) => void;
  onClickDelete: (commentId: string) => void;
}

const UserComment = ({ comment, onClickReply, onClickDelete }: IUserCommentProps) => {
  const { data: session, status } = useSession();

  const handleReplyClicked = (commentId: string) => {
    onClickReply(commentId);
  };

  const handleDeleteClicked = (commentId: string) => {
    onClickDelete(commentId);
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
                handleReplyClicked(comment.id);
              }}
            >
              {`Reply`}
            </button>

            {/* delete */}
            {session?.user.username === AdministrativeUser.ADMIN && (
              <div className="mx-1 flex items-center">
                <ActionButton
                  size={Size.XS}
                  action={Action.DELETE}
                  onClick={() => {
                    handleDeleteClicked(comment.id);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserComment;
