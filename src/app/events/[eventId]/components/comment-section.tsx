'use client';

import { EventComment } from '@/types/event-comment';
import UserComment from '../../../../components/events/comment/EventComment';
import { EventSubComment } from '@/types/event-sub-comment';
import { useEffect, useState } from 'react';
import PostInput from '../../../../components/events/comment/PostInput';
import { useTranslations } from 'next-intl';

interface ICommentSectionProps {
  eventComments: EventComment[];
  username: string;
  userProfileImageUrl?: string;
  onPostComment: (message: string) => void;
  onPostReply: (commentId: string, message: string) => void;
}

export const CommentSection = ({ eventComments, username, userProfileImageUrl, onPostComment, onPostReply }: ICommentSectionProps) => {
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
              <UserComment
                comment={comment}
                onClickReply={(commentId: string) => {
                  setReplyTo(commentId);
                  focusInput();
                }}
              />

              {comment.subComments &&
                comment.subComments.length > 0 &&
                comment.subComments.map((subComment: EventSubComment, j) => {
                  return (
                    // ml-9: image width + gap beween image and message
                    <div key={j} className={`ml-9 w-3/4`}>
                      <UserComment
                        comment={{ id: subComment.id, message: subComment.message, user: subComment.user, timestamp: subComment.timestamp, subComments: [] }}
                        onClickReply={(commentId: string) => {
                          setReplyTo(subComment.rootCommentId);
                          focusInput();
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
