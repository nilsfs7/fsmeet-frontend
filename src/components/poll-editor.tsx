'use client';

import { useEffect, useState } from 'react';
import TextInputLarge from './common/text-input-large';
import { EditorMode } from '@/domain/enums/editor-mode';
import { useTranslations } from 'next-intl';
import { Poll } from '@/domain/types/poll';
import TextInput from './common/text-input';
import ActionButton from './common/action-button';
import { Action } from '@/domain/enums/action';
import moment from 'moment';
import { DatePicker } from './common/date-picker';
import CheckBox from './common/check-box';
import Separator from './separator';
import ComboBox from './common/combo-box';
import { menuCountriesWithUnspecified } from '@/domain/constants/menus/menu-countries';
import { TargetGroup } from '@/domain/types/target-group';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

const FIELD_ROW_CLASS = 'flex min-w-0 flex-col gap-1.5 sm:grid sm:grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] sm:items-center sm:gap-3';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full sm:min-w-0';
/** Same as `CheckBox` right column: start-aligned, `min-h-10` to match control row height. */
const FIELD_CONTROL_TALL_INNER = 'flex min-h-10 w-full min-w-0 items-center';

interface IPollEditorProps {
  editorMode: EditorMode;
  poll?: Poll;
  onPollUpdate: (pollData: { question: string; description: string; options: string[]; deadline: string | null; targetGroup: TargetGroup }) => void;
}

const PollEditor = ({ editorMode, poll, onPollUpdate }: IPollEditorProps) => {
  const t = useTranslations('global/components/poll-editor');
  const { data: session } = useSession();

  const QUESTION_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;
  const OPTION_MAX_LENGTH = 100;

  const [question, setQuestion] = useState(poll?.question || '');
  const [description, setDescription] = useState(poll?.description || '');
  const [options, setOptions] = useState(
    poll?.options.map(o => {
      return o.option;
    }) || ['', ''],
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
    if (session?.user.username) {
      onPollUpdate({
        question,
        description,
        options,
        deadline: deadlineEnabled ? deadline : null,
        targetGroup,
      });
    }
  };

  // fires back poll
  useEffect(() => {
    updatePoll();
  }, [question, description, options, deadlineEnabled, deadline, targetGroup]);

  return (
    <div
      className={cn(
        'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
        'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
        'supports-[backdrop-filter]:bg-secondary-light/70',
        'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
        '[&>div.m-2]:!m-0',
      )}
    >
      <TextInputLarge
        id="poll-question"
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
        id="poll-description"
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
            id={`poll-option-${i}`}
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

      <div className="flex items-center justify-end gap-2 pt-0.5">
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
        id="poll-deadline-enabled"
        label={t('chbDeadlineEnabled')}
        value={deadlineEnabled}
        onChange={() => {
          setDeadlineEnabled(!deadlineEnabled);
        }}
      />
      {deadlineEnabled && (
        <div className={FIELD_ROW_CLASS}>
          <div className={FIELD_LABEL_CLASS}>{t('dateDeadline')}</div>
          <div className={FIELD_CONTROL_CLASS}>
            <div className={FIELD_CONTROL_TALL_INNER}>
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
          </div>
        </div>
      )}

      <div className="py-1">
        <Separator />
      </div>

      <h2 className="text-sm font-semibold leading-tight text-foreground/90">{t('sectionTargetGroup')}</h2>

      <div className={FIELD_ROW_CLASS}>
        <div className={FIELD_LABEL_CLASS}>{t('cbCountry')}</div>
        <div className={FIELD_CONTROL_CLASS}>
          <ComboBox
            menus={menuCountriesWithUnspecified}
            value={targetGroup.countryCode || menuCountriesWithUnspecified[0].value}
            searchEnabled={true}
            onChange={handleCountryCodeChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default PollEditor;
