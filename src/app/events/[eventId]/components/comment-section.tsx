'use client';

import { EventComment } from '@/domain/types/event-comment';
import UserComment from '../../../../components/events/comment/event-comment';
import { EventSubComment } from '@/domain/types/event-sub-comment';
import { useEffect, useRef, useState } from 'react';
import PostInput from '../../../../components/events/comment/post-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const cardSurface = cn('h-fit min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-xs');

/** How long a freshly posted comment stays highlighted before it fades out. */
const HIGHLIGHT_MS = 2000;

interface ICommentSectionProps {
  eventComments: EventComment[];
  canDelete: boolean;
  username: string;
  userProfileImageUrl?: string;
  /** Posts the comment and resolves with its id (used to scroll to and highlight it once the refreshed list renders it). */
  onPostComment: (message: string) => Promise<string | void>;
  onPostReply: (commentId: string, message: string) => Promise<string | void>;
  onDeleteComment: (commentId: string, isSubComment: boolean) => void;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

export const CommentSection = ({ eventComments, canDelete, username, userProfileImageUrl, onPostComment, onPostReply, onDeleteComment }: ICommentSectionProps) => {
  const t = useTranslations('/events/eventid');


  const [newComment, setNewComment] = useState<string>('');
  const [replyTo, setReplyTo] = useState<string>();
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [posting, setPosting] = useState<'comment' | 'reply'>();

  const [highlightId, setHighlightId] = useState<string>();
  const [highlightOn, setHighlightOn] = useState(false);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Id of a just-posted comment that still has to be scrolled to (it appears once the refreshed list arrives). */
  const [pendingRevealId, setPendingRevealId] = useState<string>();

  // as soon as the new comment is rendered: scroll it into view, highlight it, fade the highlight out
  useEffect(() => {
    if (!pendingRevealId) return;
    const el = document.getElementById(`comment-${pendingRevealId}`);
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    clearTimeout(highlightTimer.current);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to the DOM node appearing after the server refresh
    setHighlightId(pendingRevealId);
    setHighlightOn(true);
    setPendingRevealId(undefined);
    highlightTimer.current = setTimeout(() => setHighlightOn(false), HIGHLIGHT_MS);
  }, [pendingRevealId, eventComments]);

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const handlePostCommentClicked = async () => {
    const message = newComment.trim();
    if (!message || posting) return;

    setPosting('comment');
    try {
      const id = await onPostComment(message);
      setNewComment('');
      toast.success(t('toastCommentPosted'));
      if (id) setPendingRevealId(id);
    } catch (error: unknown) {
      // keep the text so the user can retry
      toast.error(getErrorMessage(error, t('toastCommentFailed')));
    } finally {
      setPosting(undefined);
    }
  };

  const handlePostReplyClicked = async () => {
    const message = replyMessage.trim();
    if (!replyTo || !message || posting) return;

    const parentId = replyTo;
    setPosting('reply');
    try {
      const id = await onPostReply(parentId, message);
      setReplyTo('');
      setReplyMessage('');
      toast.success(t('toastReplyPosted'));
      if (id) setPendingRevealId(id);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t('toastCommentFailed')));
    } finally {
      setPosting(undefined);
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

  const highlightClass = (id: string) =>
    cn(
      '-m-1 rounded-xl p-1 ring-0 ring-brand/50 transition-[background-color,box-shadow] duration-700 ease-out motion-reduce:transition-none',
      highlightId === id && highlightOn && 'bg-brand-soft ring-2 duration-150',
    );

  return (
    <div className={cardSurface}>
      <div className="flex min-h-0 min-w-0 flex-col gap-3 p-4 sm:p-6">
        <h2 className="text-base font-semibold leading-tight tracking-tight text-foreground">{t('tabOverviewSectionComments')}</h2>

        {/* new comment */}
        {username && (
          <div className="flex w-full min-w-0 flex-col sm:max-w-[75%]">
            <PostInput
              elementId="newComment"
              username={username}
              userProfileImageUrl={userProfileImageUrl}
              value={newComment}
              posting={posting === 'comment'}
              sendLabel={t('btnPostComment')}
              onMessageChange={setNewComment}
              onSendReplyClick={handlePostCommentClicked}
            />
          </div>
        )}

        {/* posted comments */}
        <div className="flex flex-col gap-2">
          {eventComments.map((comment: EventComment) => {
            return (
              <div key={comment.id} className="flex flex-col gap-1">
                {/* root comments */}
                <div id={`comment-${comment.id}`} className={cn('scroll-mt-24', highlightClass(comment.id))} data-highlighted={highlightId === comment.id && highlightOn ? 'true' : undefined}>
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
                </div>

                {/* sub comments */}
                {comment.subComments &&
                  comment.subComments.length > 0 &&
                  comment.subComments.map((subComment: EventSubComment) => {
                    return (
                      // ml-9: image width + gap between image and message (no w-full: that would overflow the card by 2.25rem)
                      <div key={subComment.id} className="ml-9 min-w-0 sm:max-w-[75%]">
                        <div
                          id={`comment-${subComment.id}`}
                          className={cn('scroll-mt-24', highlightClass(subComment.id))}
                          data-highlighted={highlightId === subComment.id && highlightOn ? 'true' : undefined}
                        >
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
                      </div>
                    );
                  })}

                {/* reply context */}
                {replyTo === comment.id && (
                  // ml-9: image width + gap between image and message (no w-full: that would overflow the card by 2.25rem)
                  <div className="ml-9 grid min-w-0 sm:max-w-[75%]">
                    <PostInput
                      elementId="reply"
                      username={username}
                      userProfileImageUrl={userProfileImageUrl}
                      value={replyMessage}
                      posting={posting === 'reply'}
                      sendLabel={t('btnPostReply')}
                      onMessageChange={setReplyMessage}
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
