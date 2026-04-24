'use client';

import { EventComment } from '@/domain/types/event-comment';
import UserComment from '../../../../components/events/comment/event-comment';
import { EventSubComment } from '@/domain/types/event-sub-comment';
import { useEffect, useState } from 'react';
import PostInput from '../../../../components/events/comment/post-input';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const cardSurface = cn(
  'h-fit min-w-0 overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

interface ICommentSectionProps {
  eventComments: EventComment[];
  canDelete: boolean;
  username: string;
  userProfileImageUrl?: string;
  onPostComment: (message: string) => void;
  onPostReply: (commentId: string, message: string) => void;
  onDeleteComment: (commentId: string, isSubComment: boolean) => void;
}

export const CommentSection = ({ eventComments, canDelete, username, userProfileImageUrl, onPostComment, onPostReply, onDeleteComment }: ICommentSectionProps) => {
  const t = useTranslations('/events/eventid');

  const [newComment, setNewComment] = useState<string>();
  const [replyTo, setReplyTo] = useState<string>();
  const [replyMessage, setReplyMessage] = useState<string>();

  const handleNewCommentMessageChanged = async (message: string) => {
    setNewComment(message.trim());
  };

  const handleReplyMessageChanged = async (message: string) => {
    setReplyMessage(message.trim());
  };

  const handlePostCommentClicked = async () => {
    if (newComment) {
      onPostComment(newComment);

      setNewComment('');
    }
  };

  const handlePostReplyClicked = async () => {
    if (replyTo && replyMessage) {
      onPostReply(replyTo, replyMessage);

      setReplyTo('');
      setReplyMessage('');
    }
  };

  const focusInput = async () => {
    const replyInput = document.getElementById('reply');
    if (replyInput) {
      replyInput.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [replyTo]);

  return (
    <div className={cardSurface}>
      <div className="flex min-h-0 min-w-0 flex-col gap-3 p-2.5 sm:p-3 md:p-4">
        <h2 className="text-base font-semibold leading-tight tracking-tight text-foreground">
          {t('tabOverviewSectionComments')}
        </h2>

        {/* new comment */}
        {username && (
          <div className="flex w-full min-w-0 flex-col sm:max-w-[75%]">
            <PostInput
              elementId="newComment"
              username={username}
              userProfileImageUrl={userProfileImageUrl}
              onMessageChange={(message: string) => {
                handleNewCommentMessageChanged(message);
              }}
              onSendReplyClick={handlePostCommentClicked}
            />
          </div>
        )}

        {/* posted comments */}
        <div className="flex flex-col gap-2">
          {eventComments.map((comment: EventComment, i) => {
            return (
              <div key={i} className="flex flex-col gap-1">
                {/* root comments */}
                <UserComment
                  comment={comment}
                  canDelete={canDelete}
                  onClickReply={() => {
                    setReplyTo(comment.id);
                    focusInput();
                  }}
                  onClickDelete={(commentId: string) => {
                    onDeleteComment(commentId, false);
                  }}
                />

                {/* sub comments */}
                {comment.subComments &&
                  comment.subComments.length > 0 &&
                  comment.subComments.map((subComment: EventSubComment, j) => {
                    return (
                      // ml-9: image width + gap between image and message
                      <div key={j} className="ml-9 w-full min-w-0 sm:max-w-[75%]">
                        <UserComment
                          comment={{ id: subComment.id, message: subComment.message, user: subComment.user, timestamp: subComment.timestamp, subComments: [] }}
                          canDelete={canDelete}
                          onClickReply={() => {
                            setReplyTo(comment.id);
                            focusInput();
                          }}
                          onClickDelete={(commentId: string) => {
                            onDeleteComment(commentId, true);
                          }}
                        />
                      </div>
                    );
                  })}

                {/* reply context */}
                {replyTo === comment.id && (
                  // ml-9: image width + gap between image and message
                  <div className="ml-9 grid w-full min-w-0 sm:max-w-[75%]">
                    <PostInput
                      elementId="reply"
                      username={username}
                      userProfileImageUrl={userProfileImageUrl}
                      onMessageChange={(message: string) => {
                        handleReplyMessageChanged(message);
                      }}
                      onSendReplyClick={handlePostReplyClicked}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
