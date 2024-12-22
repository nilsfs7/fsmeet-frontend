'use client';

import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { Poll } from '@/types/poll';
import TextButton from '@/components/common/TextButton';
import { Progress } from '@/components/ui/progress';
import { routeLogin } from '@/domain/constants/routes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Vote } from '@/types/vote';
import { createVote, getVotes } from '@/infrastructure/clients/poll.client';
import { useRouter, useSearchParams } from 'next/navigation';
import UserCard from '@/components/user/UserCard';
import { Toaster, toast } from 'sonner';

interface IPollsCarousel {
  initPolls: Poll[];
}

export const PollsCarousel = ({ initPolls }: IPollsCarousel) => {
  const t = useTranslations('/voice');

  const { data: session, status } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const focus = searchParams?.get('select');

  const [polls, setPolls] = useState<Poll[]>(initPolls);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);
  const [myUnconfirmedVote, setMyUnconfirmedVote] = useState<Vote>();

  const [api, setApi] = useState<CarouselApi>();

  const scrollToItem = (index: number) => {
    if (!api) {
      return;
    }

    api.scrollTo(index);
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

          // update polls without reloading
          let plls = Array.from(polls);
          plls = plls.map(pll => {
            if (pll.id === poll.id) {
              return poll;
            }
            return pll;
          });
          setPolls(plls);

          toast.success('Vote submitted.');
        } catch (error: any) {
          toast.error(error.message);
          console.error(error.message);
        }
      }
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

  useEffect(() => {
    if (session) {
      getVotes(session).then(votes => {
        setMyVotes(votes);
      });
    }
  }, [session]);

  useEffect(() => {
    if (focus) scrollToItem(+focus);
  }, [focus]);

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
                <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm hover:border-primary'}>
                  <h1 className="mt-2 text-2xl">{polls[i].question}</h1>

                  <div className="mt-2 max-h-full justify-center px-1">
                    <div className="w-full mt-2">
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
                              <div className="w-3/5">{`${j + 1}) ${item.option}`}</div>

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

                    <div className="flex justify-end mt-2 text-xs">{`${t('carouselTotalVotes')}: ${polls[i].totalVotes}`}</div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <UserCard user={polls[i].questioner} showFirstNameOnly={true} />

                    <TextButton
                      text={polls[i]?.deadline && moment(polls[i]?.deadline) < moment() ? t('carouselBtnVotingEnded') : t('carouselBtnVote')}
                      disabled={polls[i].deadline && moment(polls[i].deadline) < moment() ? true : false}
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
