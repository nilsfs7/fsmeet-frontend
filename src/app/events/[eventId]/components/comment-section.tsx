'use client';

import { EventComment } from '@/domain/types/event-comment';
import UserComment from '../../../../components/events/comment/event-comment';
import { EventSubComment } from '@/domain/types/event-sub-comment';
import { useEffect, useState } from 'react';
import PostInput from '../../../../components/events/comment/post-input';
import { useTranslations } from 'next-intl';

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
    <div className={'flex flex-col gap-2 rounded-lg border border-secondary-dark bg-secondary-light p-2'}>
      <div className="text-base font-bold">{t('tabOverviewSectionComments')}</div>

      {/* new comment */}
      {username && (
        <div className={`flex w-3/4 flex-col`}>
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
      <div className="mt-2 flex flex-col gap-2">
        {eventComments.map((comment: EventComment, i) => {
          return (
            <div key={i} className={`flex flex-col gap-1`}>
              {/* root comments */}
              <UserComment
                comment={comment}
                canDelete={canDelete}
                onClickReply={(commentId: string) => {
                  setReplyTo(commentId);
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
                    // ml-9: image width + gap beween image and message
                    <div key={j} className={`ml-9 w-3/4`}>
                      <UserComment
                        comment={{ id: subComment.id, message: subComment.message, user: subComment.user, timestamp: subComment.timestamp, subComments: [] }}
                        canDelete={canDelete}
                        onClickReply={(commentId: string) => {
                          setReplyTo(subComment.rootCommentId);
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
                // ml-9: image width + gap beween image and message
                <div className={`ml-9 grid w-3/4`}>
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
  );
};
