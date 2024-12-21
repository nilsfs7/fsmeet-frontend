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

  const handleOptionUpdated = async (value: string, index: number) => {
    const newArray = Array.from(options);
    newArray[index] = value;
    setOptions(newArray);
  };

  const handleAddQuestionClicked = async () => {
    const newArray = Array.from(options);
    newArray.push('');
    setOptions(newArray);
  };

  const handleRemoveQuestionClicked = async (index: number) => {
    try {
      const newArray = Array.from(options);
      newArray.splice(index, 1);
      setOptions(newArray);
    } catch (error: any) {
      console.error(error.message);
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
      creationTime: moment().utc().format(),
    });
  };

  // fires back poll
  useEffect(() => {
    updatePoll();
  }, [question, options]);

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1 overflow-y-auto">
      <TextInputLarge
        id={'question'}
        label={t('inputQuestion')}
        placeholder="Do you like FSMeet?"
        value={question}
        resizable={true}
        onChange={e => {
          setQuestion(e.currentTarget.value);
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

      <div className="flex p-2 gap-2 justify-end">
        <ActionButton
          action={Action.REMOVE}
          onClick={() => {
            handleRemoveQuestionClicked(options.length - 1);
          }}
        />
        <ActionButton action={Action.ADD} onClick={handleAddQuestionClicked} />
      </div>
    </div>
  );
};

export default PollEditor;
