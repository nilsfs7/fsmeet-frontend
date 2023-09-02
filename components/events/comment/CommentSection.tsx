import { EventComment } from '@/types/event-comment';
import UserComment from './EventComment';
import { EventSubComment } from '@/types/event-sub-comment';
import { useEffect, useState } from 'react';
import ReplyContext from './ReplyInput';

interface ICommentSectionProps {
  eventComments: EventComment[];
  onSendReply: (commentId: string, message: string) => void;
}

const CommentSection = ({ eventComments, onSendReply }: ICommentSectionProps) => {
  const [replyTo, setReplyTo] = useState<string>();
  const [replyMessage, setReplyMessage] = useState<string>();

  const handleReplyMessageChanged = async (replyMessage: string) => {
    setReplyMessage(replyMessage.trim());
  };

  const handleSendReplyClicked = async () => {
    if (replyTo && replyMessage) {
      onSendReply(replyTo, replyMessage);

      setReplyTo('');
      setReplyMessage('');
    }
  };

  const focusInput = async () => {
    const replyInput = document.getElementById('replyInput');
    if (replyInput) {
      replyInput.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [replyTo]);

  return (
    <div className={'rounded-lg border border-black bg-primary-light p-2'}>
      <div className="text-base font-bold">Comments</div>
      <div className="flex flex-col flex-wrap">
        {eventComments.map((comment: EventComment, i) => {
          return (
            <div key={i} className={`mt-1 grid grid-cols-1`}>
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
                    <div key={j} className={`mt-1 flex`}>
                      {/* keep same space as image of root comment */}
                      <div className="mx-1 mt-1 h-8 w-8" />

                      <div className={`grid w-3/4`}>
                        <UserComment
                          comment={{ id: subComment.id, message: subComment.message, user: subComment.user, timestamp: subComment.timestamp, subComments: [] }}
                          onClickReply={(commentId: string) => {
                            setReplyTo(subComment.rootCommentId);
                            focusInput();
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

              {/* reply context */}
              {replyTo === comment.id && (
                <div className={`mt-1 flex`}>
                  {/* keep same space as image of root comment */}
                  <div className="mx-1 mt-1 h-8 w-8" />

                  <div className={`grid w-3/4`}>
                    <ReplyContext
                      onMessageChange={(message: string) => {
                        handleReplyMessageChanged(message);
                      }}
                      onSendReplyClick={handleSendReplyClicked}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
