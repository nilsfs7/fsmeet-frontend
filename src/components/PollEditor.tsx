'use client';

import { useEffect, useState } from 'react';
import TextInputLarge from './common/TextInputLarge';
import { EditorMode } from '@/domain/enums/editor-mode';
import { useTranslations } from 'next-intl';
import { UserType } from '@/domain/enums/user-type';
import { Poll } from '@/types/poll';
import TextInput from './common/TextInput';
import ActionButton from './common/ActionButton';
import { Action } from '@/domain/enums/action';
import moment from 'moment';
import { DatePicker } from './common/DatePicker';
import CheckBox from './common/CheckBox';

interface IPollEditorProps {
  editorMode: EditorMode;
  poll?: Poll;
  onPollUpdate: (poll: Poll) => void;
}

const PollEditor = ({ editorMode, poll, onPollUpdate }: IPollEditorProps) => {
  const t = useTranslations('global/components/poll-editor');

  const [question, setQuestion] = useState(poll?.question || '');
  const [options, setOptions] = useState(
    poll?.options.map(o => {
      return o.option;
    }) || ['', '']
  );
  const [deadlineEnabled, setDeadlineEnabled] = useState<boolean>(poll?.deadline ? true : false);
  const [deadline, setDeadline] = useState<string>(poll?.deadline ? poll.deadline : moment().endOf('day').add(3, 'month').utc().format());

  const INPUT_MAX_LENGTH = 100;

  const handleQuestionUpdated = async (value: string) => {
    if (value.length <= INPUT_MAX_LENGTH) {
      setQuestion(value);
    }
  };

  const handleOptionUpdated = async (value: string, index: number) => {
    if (value.length <= INPUT_MAX_LENGTH) {
      const newArray = Array.from(options);
      newArray[index] = value;
      setOptions(newArray);
    }
  };

  const handleAddQuestionClicked = async () => {
    if (options.length < 12) {
      const newArray = Array.from(options);
      newArray.push('');
      setOptions(newArray);
    }
  };

  const handleRemoveQuestionClicked = async (index: number) => {
    if (options.length > 2) {
      try {
        const newArray = Array.from(options);
        newArray.splice(index, 1);
        setOptions(newArray);
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const updatePoll = () => {
    onPollUpdate({
      id: poll?.id,
      question: question,
      questioner: { username: sessionStorage.username, type: UserType.FREESTYLER }, // type is unnecessary
      options: options.map(o => {
        return { option: o, numVotes: 0 };
      }),
      totalVotes: 0,
      deadline: deadlineEnabled ? deadline : null,
      creationTime: moment().utc().format(),
    });
  };

  // fires back poll
  useEffect(() => {
    updatePoll();
  }, [question, options, deadlineEnabled, deadline]);

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1 overflow-y-auto">
      <TextInputLarge
        id={'question'}
        label={t('inputQuestion')}
        placeholder="Do you like FSMeet?"
        value={question}
        resizable={true}
        onChange={e => {
          handleQuestionUpdated(e.currentTarget.value);
        }}
      />

      {options.map((option, i) => {
        return (
          <TextInput
            key={`option-${i}`}
            id={'option'}
            label={`${t('inputOption')} ${i + 1}`}
            placeholder={`...`}
            value={option}
            onChange={e => {
              handleOptionUpdated(e.currentTarget.value, i);
            }}
          />
        );
      })}

      <CheckBox
        id={'deadlineEnabled'}
        label={t('chbDeadlineEnabled')}
        value={deadlineEnabled}
        onChange={() => {
          setDeadlineEnabled(!deadlineEnabled);
        }}
      />
      {deadlineEnabled && (
        <div className="m-2 grid grid-cols-2">
          <div>{t('dateDeadline')}</div>
          <DatePicker
            date={moment(deadline)}
            fromDate={moment(moment().year())}
            toDate={moment().add(1, 'y')}
            onChange={value => {
              if (value) {
                setDeadline(value.endOf('day').utc().format());
              }
            }}
          />
        </div>
      )}

      <div className="flex p-2 gap-2 justify-end">
        {options.length > 2 && (
          <ActionButton
            action={Action.REMOVE}
            onClick={() => {
              handleRemoveQuestionClicked(options.length - 1);
            }}
          />
        )}

        {options.length < 12 && <ActionButton action={Action.ADD} onClick={handleAddQuestionClicked} />}
      </div>
    </div>
  );
};

export default PollEditor;
