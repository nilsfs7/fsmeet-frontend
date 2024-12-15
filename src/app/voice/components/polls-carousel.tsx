'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
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
import { useRouter } from 'next/navigation';
import UserCard from '@/components/user/UserCard';
import { Toaster, toast } from 'sonner';

interface IPollsCarousel {
  initPolls: Poll[];
}

export const PollsCarousel = ({ initPolls }: IPollsCarousel) => {
  const t = useTranslations('/voice');

  const { data: session, status } = useSession();

  const router = useRouter();

  const [polls, setPolls] = useState<Poll[]>(initPolls);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);
  const [myUnconfirmedVote, setMyUnconfirmedVote] = useState<Vote>();

  const handleVoteClicked = async (pollId: string) => {
    // TODO: isAuthenticated nutzen?
    if (!session?.user.username) {
      router.push(routeLogin);
    } else {
      if (myUnconfirmedVote?.pollId === pollId) {
        createVote(myUnconfirmedVote, session).then(poll => {
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
        });
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

  return (
    <>
      <Toaster richColors />

      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 8000,
          }),
        ]}
        className="w-full max-w-lg"
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
                            <div className="w-4/5">{`${j + 1}) ${item.option}`}</div>

                            <div className="w-1/5 flex justify-between items-center gap-1">
                              <RadioGroupItem
                                value={`option-${j}`}
                                id={`option-${j}`}
                                onClick={e => {
                                  handleRadioItemClicked(polls[i].id, j);
                                }}
                              />

                              {myVotes.filter(myVote => {
                                return myVote.pollId === polls[i].id;
                              }).length > 0 && <Progress className="border border-primary" value={(item.numVotes / polls[i].totalVotes) * 100} />}
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="flex justify-end mt-2 text-xs">{`${t('totalVotes')}: ${polls[i].totalVotes}`}</div>
                </div>

                <div className="flex justify-between mt-2">
                  <UserCard user={polls[i].questioner} />

                  <TextButton
                    text={t('btnVote')}
                    onClick={() => {
                      handleVoteClicked(polls[i].id);
                    }}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};
