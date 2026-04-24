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
  canDelete: boolean;
  /** Parent decides target (e.g. root id for a subcomment thread). */
  onClickReply: () => void;
  onClickDelete: (commentId: string) => void;
}

const UserComment = ({ comment, canDelete, onClickReply, onClickDelete }: IUserCommentProps) => {
  const { data: session } = useSession();

  const handleDeleteClicked = (commentId: string) => {
    onClickDelete(commentId);
  };
  return (
    <div className="flex w-full min-w-0 gap-2 text-sm">
      <div className="h-8 w-8 shrink-0">
        <Link href={`${routeUsers}/${comment.user.username}`} className="block h-full w-full">
          <img src={comment.user.imageUrl ? comment.user.imageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-background object-cover" />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-background p-1">
          <Link href={`${routeUsers}/${comment.user.username}`} className="w-fit min-w-0 font-bold">
            {comment.user.firstName} {comment.user.lastName}
          </Link>

          <div className="break-words whitespace-pre-wrap text-foreground/90">{comment.message}</div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-1 text-xs">
          <div className="text-muted-foreground">{`${formatTs(moment(comment.timestamp), 'DD.MM HH:mm')}`}</div>

          <button type="button" className="text-foreground/90 hover:underline" onClick={onClickReply}>
            Reply
          </button>

          {/* delete */}
          {(canDelete || session?.user.username === comment.user.username || session?.user.username === AdministrativeUser.ADMIN) && (
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
  );
};

export default UserComment;
