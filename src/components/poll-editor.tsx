'use client';

import { useEffect, useState } from 'react';
import TextInputLarge from './common/text-input-large';
import { EditorMode } from '@/domain/enums/editor-mode';
import { useTranslations } from 'next-intl';
import { UserType } from '@/domain/enums/user-type';
import { Poll } from '@/domain/types/poll';
import TextInput from './common/text-input';
import ActionButton from './common/action-button';
import { Action } from '@/domain/enums/action';
import moment from 'moment';
import { DatePicker } from './common/date-picker';
import CheckBox from './common/check-box';
import Separator from './seperator';
import SectionHeader from './common/section-header';
import ComboBox from './common/combo-box';
import { menuCountriesWithUnspecified } from '@/domain/constants/menus/menu-countries';
import { TargetGroup } from '@/domain/types/target-group';

interface IPollEditorProps {
  editorMode: EditorMode;
  poll?: Poll;
  onPollUpdate: (poll: Poll) => void;
}

const PollEditor = ({ editorMode, poll, onPollUpdate }: IPollEditorProps) => {
  const t = useTranslations('global/components/poll-editor');

  const QUESTION_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;
  const OPTION_MAX_LENGTH = 100;

  const [question, setQuestion] = useState(poll?.question || '');
  const [description, setDescription] = useState(poll?.description || '');
  const [options, setOptions] = useState(
    poll?.options.map(o => {
      return o.option;
    }) || ['', '']
  );
  const [deadlineEnabled, setDeadlineEnabled] = useState<boolean>(poll?.deadline ? true : false);
  const [deadline, setDeadline] = useState<string>(poll?.deadline ? poll.deadline : moment().endOf('day').add(3, 'month').utc().format());
  const [targetGroup, setTargetGroup] = useState<TargetGroup>({ countryCode: null, maxAge: null });

  const handleQuestionUpdated = async (value: string) => {
    if (value.length <= QUESTION_MAX_LENGTH) {
      setQuestion(value);
    }
  };

  const handleDescriptionUpdated = async (value: string) => {
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(value);
    }
  };

  const handleOptionUpdated = async (value: string, index: number) => {
    if (value.length <= OPTION_MAX_LENGTH) {
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

  const handleCountryCodeChanged = (value: string | null) => {
    if (value == menuCountriesWithUnspecified[0].value) {
      value = null;
    }

    setTargetGroup({ countryCode: value, maxAge: targetGroup.maxAge });
  };

  const updatePoll = () => {
    onPollUpdate({
      id: poll?.id,
      question: question,
      description: description,
      questioner: { username: sessionStorage.username, type: UserType.FREESTYLER }, // TODO: type is unnecessary
      options: options.map(o => {
        return { option: o, numVotes: 0 };
      }),
      totalVotes: 0,
      totalRatingScore: 0,
      deadline: deadlineEnabled ? deadline : null,
      targetGroup: targetGroup,
      creationTime: moment().utc().format(),
    });
  };

  // fires back poll
  useEffect(() => {
    updatePoll();
  }, [question, description, options, deadlineEnabled, deadline, targetGroup]);

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1 overflow-y-auto">
      <TextInputLarge
        id={'question'}
        label={t('inputQuestion')}
        placeholder="Did you land PATW?"
        value={question}
        maxInputLength={QUESTION_MAX_LENGTH}
        resizable={true}
        onChange={e => {
          handleQuestionUpdated(e.currentTarget.value);
        }}
      />

      <TextInputLarge
        id={'description'}
        label={t('inputDescription')}
        placeholder="Provide some context for your question"
        value={description}
        maxInputLength={DESCRIPTION_MAX_LENGTH}
        resizable={true}
        onChange={e => {
          handleDescriptionUpdated(e.currentTarget.value);
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
            maxInputLength={OPTION_MAX_LENGTH}
            onChange={e => {
              handleOptionUpdated(e.currentTarget.value, i);
            }}
          />
        );
      })}

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

      <CheckBox
        id={'deadlineEnabled'}
        label={t('chbDeadlineEnabled')}
        value={deadlineEnabled}
        onChange={() => {
          setDeadlineEnabled(!deadlineEnabled);
        }}
      />
      {deadlineEnabled && (
        <div className="m-2 grid grid-cols-2 items-center gap-2">
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

      <div className="m-2">
        <Separator />
      </div>
      <SectionHeader label={t('sectionTargetGroup')} />

      <div className="m-2 grid grid-cols-2 items-center gap-2">
        <div>{t('cbCountry')}</div>
        <div className="flex w-full">
          <ComboBox
            menus={menuCountriesWithUnspecified}
            value={targetGroup.countryCode || menuCountriesWithUnspecified[0].value}
            searchEnabled={true}
            onChange={(value: any) => {
              handleCountryCodeChanged(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PollEditor;
