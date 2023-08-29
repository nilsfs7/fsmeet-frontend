import Link from 'next/link';
import { EventQuestion } from '@/types/event-question';
import { formatTs } from '@/types/funcs/time';

interface IQuestionSectionProps {
  eventQuestions: EventQuestion[];
}

const QuestionSection = ({ eventQuestions }: IQuestionSectionProps) => {
  return (
    <div className={'rounded-lg border border-black bg-zinc-300 p-2 text-sm'}>
      <div className="text-base font-bold">Questions</div>
      <div className="flex flex-col flex-wrap">
        {eventQuestions.map((question, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === eventQuestions.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-2 ${margin} flex gap-2`}>
              <div>{`${formatTs(question.timestamp, 'DD.MM HH:mm')}`}</div>
              <Link href={`/user/${question.askingUser}`}>
                <div>{`${question.askingUser}:`}</div>
              </Link>
              <div>{`${question.question}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionSection;
