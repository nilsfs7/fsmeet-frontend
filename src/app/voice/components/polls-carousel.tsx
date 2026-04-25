'use client';

import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { Poll } from '@/domain/types/poll';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { routeLogin, routeVoice } from '@/domain/constants/routes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Vote } from '@/domain/types/vote';
import { createPollRating, createVote, getPollRatings, getVotes } from '@/infrastructure/clients/poll.client';
import { useRouter, useSearchParams } from 'next/navigation';
import UserCard from '@/components/user/user-card';
import { Toaster, toast } from 'sonner';
import { getShortDateString } from '@/functions/time';
import { imgAbout, imgArrowDown, imgArrowDownOutline, imgArrowUp, imgArrowUpOutline, imgHourglassEnd, imgHourglassStart } from '@/domain/constants/images';
import { RatingAction } from '@/domain/enums/rating-action';
import { PollRating } from '@/domain/types/poll-rating';
import { User } from '@/domain/types/user';
import Dialog from '@/components/dialog';
import TextareaAutosize from 'react-textarea-autosize';

interface IPollsCarousel {
  initPolls: Poll[];
  actingUser?: User;
}

export const PollsCarousel = ({ initPolls, actingUser }: IPollsCarousel) => {
  const t = useTranslations('/voice');

  const { data: session, status } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedPollId = searchParams?.get('select') || '';

  const [polls, setPolls] = useState<Poll[]>(initPolls);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);
  const [myUnconfirmedVote, setMyUnconfirmedVote] = useState<Vote>();
  const [myPollRatings, setMyPollRatings] = useState<PollRating[]>([]);

  const [smallArrowDown, setSmallArrowDown] = useState<boolean>(false);
  const [smallArrowUp, setSmallArrowUp] = useState<boolean>(false);

  const [api, setApi] = useState<CarouselApi>();

  const getPollIndexById = (id: string): number => {
    const index = polls.findIndex(p => {
      return p.id === id;
    });

    // fail save in case index is not found
    if (index === -1) return 0;

    return index;
  };

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

  const targetGroupMismatch = (poll: Poll): boolean => {
    if (poll.targetGroup?.maxAge && (!actingUser?.age || poll.targetGroup.maxAge < actingUser?.age)) {
      return true;
    }

    if (poll.targetGroup?.countryCode && poll.targetGroup.countryCode !== actingUser?.countryCode) {
      return true;
    }

    return false;
  };

  const voteDisabled = (poll: Poll): boolean => {
    if (poll.deadline && moment(poll.deadline) < moment()) {
      return true;
    }

    return targetGroupMismatch(poll);
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

  const handleShowContextClicked = async (pollId: string) => {
    router.replace(`${routeVoice}?select=${pollId}&context=1`);
  };

  const handleConfirmDialogClicked = async () => {
    router.replace(`${routeVoice}?select=${selectedPollId}`);
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
    if (selectedPollId) {
      scrollToItem(getPollIndexById(selectedPollId));
    }
  }, [selectedPollId, api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      router.replace(`voice?select=${polls[api.selectedScrollSnap()].id}`);
    });
  }, [api]);

  return (
    <>
      <Toaster richColors />
      <Dialog title={t('carouselDlgPollDescription')} queryParam="context" onConfirm={handleConfirmDialogClicked}>
        <TextareaAutosize readOnly className="resize-none overflow-hidden outline-none" value={polls[getPollIndexById(selectedPollId)]?.description} />
      </Dialog>
      <div className="flex w-full max-w-xl justify-center">
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
                <div
                  className={
                    'group h-[18rem] overflow-hidden rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 text-sm shadow-xs backdrop-blur-sm supports-[backdrop-filter]:bg-secondary-light/70 transition-all duration-200 hover:border-primary/50 hover:shadow-md dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40'
                  }
                >
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="grid grid-cols-[auto,1fr] justify-start items-start gap-2">
                      <div className="flex flex-col items-center gap-2">
                        <UserCard user={polls[i].questioner} showName={false} />

                        {polls[i].description && (
                          <button
                            className="h-8"
                            onClick={() => {
                              const id = polls[i].id;
                              if (id) handleShowContextClicked(id);
                            }}
                          >
                            <img src={imgAbout} className="h-6 w-6 hover:w-7 hover:h-7 rounded-full object-cover" />
                          </button>
                        )}
                      </div>

                      <h1 className="mt-2 flex items-center gap-2 break-words text-xl">{polls[i].question}</h1>
                    </div>

                    <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-1 scrollbar-none">
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

                    <div className="mt-4 flex shrink-0 justify-between px-1 text-xs">
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

                    <div className="mt-4 flex shrink-0 items-center justify-between gap-2">
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

                      <Button
                        type="button"
                        variant="action"
                        className={ctaActionButtonClassName}
                        disabled={voteDisabled(polls[i])}
                        onClick={() => {
                          const poll = polls[i];
                          if (poll?.id) handleVoteClicked(poll.id);
                        }}
                      >
                        {polls[i]?.deadline && moment(polls[i]?.deadline) < moment()
                          ? t('carouselBtnVotingEnded')
                          : targetGroupMismatch(polls[i])
                            ? t('carouselBtnVotingExcluded')
                            : t('carouselBtnVote')}
                      </Button>
                    </div>
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
