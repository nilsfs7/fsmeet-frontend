'use client';

import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { Poll } from '@/types/poll';
import TextButton from '@/components/common/TextButton';
import { Progress } from '@/components/ui/progress';
import { routeLogin, routeVoice } from '@/domain/constants/routes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Vote } from '@/types/vote';
import { createPollRating, createVote, getPollRatings, getVotes } from '@/infrastructure/clients/poll.client';
import { useRouter, useSearchParams } from 'next/navigation';
import UserCard from '@/components/user/UserCard';
import { Toaster, toast } from 'sonner';
import { getShortDateString } from '@/functions/time';
import { imgAbout, imgArrowDown, imgArrowDownOutline, imgArrowUp, imgArrowUpOutline, imgHourglassEnd, imgHourglassStart } from '@/domain/constants/images';
import { RatingAction } from '@/domain/enums/rating-action';
import { PollRating } from '@/types/poll-rating';
import { User } from '@/types/user';
import Dialog from '@/components/Dialog';
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface IPollsCarousel {
  initPolls: Poll[];
  actingUser?: User;
}

export const PollsCarousel = ({ initPolls, actingUser }: IPollsCarousel) => {
  const t = useTranslations('/voice');

  const { data: session, status } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const focus = searchParams?.get('select');

  const [polls, setPolls] = useState<Poll[]>(initPolls);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);
  const [myUnconfirmedVote, setMyUnconfirmedVote] = useState<Vote>();
  const [myPollRatings, setMyPollRatings] = useState<PollRating[]>([]);

  const [smallArrowDown, setSmallArrowDown] = useState<boolean>(false);
  const [smallArrowUp, setSmallArrowUp] = useState<boolean>(false);

  const [api, setApi] = useState<CarouselApi>();

  const updatePolls = (poll: Poll) => {
    let plls = Array.from(polls);
    plls = plls.map(pll => {
      if (pll.id === poll.id) {
        return poll;
      }
      return pll;
    });
    setPolls(plls);
  };

  const updatePollRatings = (pollId: string, action: RatingAction) => {
    // TODO: isAuthenticated nutzen?
    if (!session?.user.username) {
      router.push(routeLogin);
    } else {
      let ratingExists = false;

      let rtngs = Array.from(myPollRatings);
      rtngs = rtngs.map(rtng => {
        if (rtng.pollId === pollId) {
          rtng.score = action;
          ratingExists = true;
        }
        return rtng;
      });

      if (!ratingExists) {
        rtngs.push({ pollId: pollId, username: session.user.username, score: action });
      }

      setMyPollRatings(rtngs);
    }
  };

  const checkPollUpvoted = (pollId: string): boolean => {
    return (
      myPollRatings.filter(pollRating => {
        return pollRating.pollId === pollId && pollRating.score === RatingAction.UP;
      }).length === 1
    );
  };

  const checkPollDownvoted = (pollId: string): boolean => {
    return (
      myPollRatings.filter(pollRating => {
        return pollRating.pollId === pollId && pollRating.score === RatingAction.DOWN;
      }).length === 1
    );
  };

  const scrollToItem = (index: number) => {
    if (!api) {
      return;
    }

    api.scrollTo(index);
  };

  const targetGroupMissmatch = (poll: Poll): boolean => {
    if (poll.targetGroup?.maxAge && (!actingUser?.age || poll.targetGroup.maxAge < actingUser?.age)) {
      return true;
    }

    if (poll.targetGroup?.country && poll.targetGroup.country !== actingUser?.country) {
      return true;
    }

    return false;
  };

  const voteDisabled = (poll: Poll): boolean => {
    if (poll.deadline && moment(poll.deadline) < moment()) {
      return true;
    }

    return targetGroupMissmatch(poll);
  };

  const handleVoteClicked = async (pollId: string) => {
    // TODO: isAuthenticated nutzen?
    if (!session?.user.username) {
      router.push(routeLogin);
    } else {
      if (myUnconfirmedVote?.pollId === pollId) {
        try {
          const poll = await createVote(myUnconfirmedVote, session);

          // insert vote into my votes if not exists without reloading
          let vts = Array.from(myVotes);
          if (
            !vts.some(vt => {
              return vt.pollId === myUnconfirmedVote.pollId;
            })
          ) {
            vts.push(myUnconfirmedVote);
          }
          setMyVotes(vts);

          updatePolls(poll);

          toast.success('Vote submitted.');
        } catch (error: any) {
          toast.error(error.message);
          console.error(error.message);
        }
      }
    }
  };

  const handleDownvotelicked = async (pollId: string) => {
    // TODO: isAuthenticated nutzen?
    if (!session?.user.username) {
      router.push(routeLogin);
    } else {
      const isDownvoted = checkPollDownvoted(pollId);

      try {
        const poll = await createPollRating(pollId, isDownvoted ? RatingAction.REVOKE : RatingAction.DOWN, session);
        updatePolls(poll);

        toast.success(isDownvoted ? 'Downvote revoked.' : 'Downvoted.');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }

      updatePollRatings(pollId, isDownvoted ? RatingAction.REVOKE : RatingAction.DOWN);
    }
  };

  const handleUpvotelicked = async (pollId: string) => {
    // TODO: isAuthenticated nutzen?
    if (!session?.user.username) {
      router.push(routeLogin);
    } else {
      const isUpvoted = checkPollUpvoted(pollId);

      try {
        const poll = await createPollRating(pollId, isUpvoted ? RatingAction.REVOKE : RatingAction.UP, session);
        updatePolls(poll);

        toast.success(isUpvoted ? 'Upvote revoked.' : 'Upvoted.');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }

      updatePollRatings(pollId, isUpvoted ? RatingAction.REVOKE : RatingAction.UP);
    }
  };

  function handleRadioItemClicked(pollId: string, optionIndex: number) {
    // TODO: isAuthenticated nutzen?
    if (!session?.user.username) {
      router.push(routeLogin);
    } else {
      let vts = Array.from(myVotes);

      const vote: Vote = { pollId: pollId, username: session.user.username, optionIndex: optionIndex };

      vts = vts.map(vt => {
        if (vt.pollId === vote.pollId) {
          vt.optionIndex = vote.optionIndex;
        }
        return vt;
      });

      setMyVotes(vts);
      setMyUnconfirmedVote(vote);
    }
  }

  const handleShowContextClicked = async (pollId: number) => {
    router.replace(`${routeVoice}?select=${pollId}&context=1`);
  };

  const handleConfirmDialogClicked = async () => {
    if (focus) router.replace(`${routeVoice}?select=${+focus}`);
  };

  useEffect(() => {
    if (session) {
      getVotes(session).then(votes => {
        setMyVotes(votes);
      });

      getPollRatings(session).then(ratings => {
        setMyPollRatings(ratings);
      });
    }
  }, [session]);

  useEffect(() => {
    if (focus) {
      scrollToItem(+focus);
    }
  }, [focus, api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      const url = `voice?select=${api.selectedScrollSnap()}`;
      router.replace(url);
    });
  }, [api]);

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('carouselDlgPollDescription')} queryParam="context" onConfirm={handleConfirmDialogClicked}>
        {focus && <TextareaAutosize readOnly className="resize-none overflow-hidden outline-none" value={polls[+focus].description} />}
      </Dialog>

      <div className="w-full max-w-xl min-h-10 flex justify-center">
        {polls.length === 0 && <div>{t('carouselNoData')}</div>}

        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
          }}
          plugins={[]}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: polls.length }).map((_, i) => (
              <CarouselItem key={`poll-${i}`}>
                <div className={'max-h-72 overflow-y-auto rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm hover:border-primary'}>
                  <div className="grid grid-cols-[auto,1fr] justify-start items-start gap-2">
                    <div className="flex flex-col items-center gap-2">
                      <UserCard user={polls[i].questioner} showName={false} />

                      {polls[i].description && (
                        <button
                          className="h-8"
                          onClick={() => {
                            handleShowContextClicked(i);
                          }}
                        >
                          <img src={imgAbout} className="h-6 w-6 hover:w-7 hover:h-7 rounded-full object-cover" />
                        </button>
                      )}
                    </div>

                    <h1 className="flex items-center gap-2 mt-2 text-2xl break-words">{polls[i].question}</h1>
                  </div>

                  <div className="mt-2 max-h-full justify-center px-1">
                    <RadioGroup
                      value={`option-${
                        (
                          myVotes.filter(myVote => {
                            return myVote.pollId === polls[i].id;
                          })[0] || (myUnconfirmedVote?.pollId === polls[i].id ? myUnconfirmedVote : null)
                        )?.optionIndex
                      }`}
                    >
                      {polls[i].options.map((item, j: number) => {
                        return (
                          <div key={j.toString()} className={'flex py-1 gap-1'}>
                            <div className="w-3/5 break-words">{`${j + 1}) ${item.option}`}</div>

                            <div className="w-2/5 flex justify-between items-center gap-1">
                              <RadioGroupItem
                                value={`option-${j}`}
                                id={`option-${j}`}
                                disabled={polls[i].deadline && moment(polls[i].deadline) < moment() ? true : false}
                                onClick={e => {
                                  const poll = polls[i];
                                  if (poll?.id) handleRadioItemClicked(poll.id, j);
                                }}
                              />

                              {((polls[i].deadline && moment(polls[i].deadline) < moment()) ||
                                myVotes.filter(myVote => {
                                  return myVote.pollId === polls[i].id;
                                }).length > 0) && <Progress className="border border-primary" value={(item.numVotes / polls[i].totalVotes) * 100} />}
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between mt-6 text-xs px-1">
                    <div>
                      {polls[i]?.deadline && (
                        <div className="flex items-center">
                          <img src={moment(polls[i].deadline) > moment() ? imgHourglassStart : imgHourglassEnd} className="h-4 w-4 object-fill" />

                          <div>{getShortDateString(moment(polls[i]?.deadline))}</div>
                        </div>
                      )}
                    </div>

                    <div>{`${t('carouselTotalVotes')}: ${polls[i].totalVotes}`}</div>
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-4 h-full">
                    <div className="flex h-10 w-16">
                      <button
                        className={`h-full w-full flex items-center justify-center border-y border-x border-secondary-dark ${voteDisabled(polls[i]) ?? 'hover:border-primary'} rounded-l-lg`}
                        disabled={voteDisabled(polls[i])}
                        onClick={() => {
                          const poll = polls[i];
                          if (poll?.id) handleUpvotelicked(poll.id);
                          setSmallArrowUp(false);
                        }}
                        onMouseOver={() => {
                          setSmallArrowUp(true);
                        }}
                        onMouseOut={() => {
                          setSmallArrowUp(false);
                        }}
                      >
                        <img
                          src={
                            myPollRatings.filter(pollRating => {
                              return pollRating.pollId === polls[i].id && pollRating.score === RatingAction.UP;
                            }).length > 0
                              ? imgArrowUp
                              : imgArrowUpOutline
                          }
                          className={`${smallArrowUp ? 'h-5 w-5' : 'h-6 w-6'} rounded-full object-cover`}
                        />
                      </button>
                      <button
                        className={`h-full w-full flex items-center justify-center border-y border-x border-secondary-dark ${voteDisabled(polls[i]) ?? 'hover:border-primary'}hover:border-l rounded-r-lg`}
                        disabled={voteDisabled(polls[i])}
                        onClick={() => {
                          const poll = polls[i];
                          if (poll?.id) handleDownvotelicked(poll.id);
                          setSmallArrowDown(false);
                        }}
                        onMouseOver={() => {
                          setSmallArrowDown(true);
                        }}
                        onMouseOut={() => {
                          setSmallArrowDown(false);
                        }}
                      >
                        <img
                          src={
                            myPollRatings.filter(pollRating => {
                              return pollRating.pollId === polls[i].id && pollRating.score === RatingAction.DOWN;
                            }).length > 0
                              ? imgArrowDown
                              : imgArrowDownOutline
                          }
                          className={`${smallArrowDown ? 'h-5 w-5' : 'h-6 w-6'} rounded-full object-cover`}
                        />
                      </button>
                    </div>

                    <TextButton
                      text={
                        polls[i]?.deadline && moment(polls[i]?.deadline) < moment()
                          ? t('carouselBtnVotingEnded')
                          : targetGroupMissmatch(polls[i])
                            ? t('carouselBtnVotingExcluded')
                            : t('carouselBtnVote')
                      }
                      disabled={voteDisabled(polls[i])}
                      onClick={() => {
                        const poll = polls[i];
                        if (poll?.id) handleVoteClicked(poll.id);
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {polls.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </>
  );
};
