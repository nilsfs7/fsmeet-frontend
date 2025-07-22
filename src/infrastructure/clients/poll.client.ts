import { Vote } from '@/domain/types/vote';
import { Poll } from '@/domain/types/poll';
import { CreatePollBodyDto } from './dtos/poll/create-poll.body.dto';
import { Session } from 'next-auth';
import { CreateVoteBodyDto } from './dtos/poll/create-vote.body.dto';
import { Moment } from 'moment';
import { RatingAction } from '@/domain/enums/rating-action';
import { CreatePollRatingBodyDto } from './dtos/poll/create-poll-rating.body.dto';
import { PollRating } from '@/domain/types/poll-rating';
import { TargetGroup } from '@/domain/types/target-group';
import { DeletePollBodyDto } from './dtos/poll/delete-poll.body.dto';

export async function getPolls(questionerUsername?: string): Promise<Poll[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls?`;

  if (questionerUsername) {
    url = url + `questioner=${questionerUsername}`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching polls.`);
  }
}

export async function createPoll(question: string, description: string, options: string[], deadline: Moment | null, targetGroup: TargetGroup, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls`;

  const body = new CreatePollBodyDto(
    question,
    description,
    options.map(option => {
      return { option: option };
    }),
    deadline,
    { maxAge: targetGroup.maxAge, country: targetGroup.country }
  );

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating poll successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deletePoll(pollId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls`;

  const body = new DeletePollBodyDto(pollId);

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting poll successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getVotes(session: Session | null): Promise<Vote[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls/user/votes`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching votes.`);
  }
}

export async function createVote(vote: Vote, session: Session | null): Promise<Poll> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls/${vote.pollId}/votes`;

  const body = new CreateVoteBodyDto(vote.optionIndex);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const responseDto = await response.json();
    console.info('Creating vote successful');

    return responseDto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getPollRatings(session: Session | null): Promise<PollRating[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls/user/ratings`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching poll ratings.`);
  }
}

export async function createPollRating(pollId: string, ratingAction: RatingAction, session: Session | null): Promise<Poll> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/polls/${pollId}/ratings`;

  const body = new CreatePollRatingBodyDto(ratingAction);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const responseDto = await response.json();
    console.info('Creating poll rating successful');

    return responseDto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
