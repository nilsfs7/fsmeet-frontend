'use client';

import { useEffect, useState, type ReactNode } from 'react';
import TextInput from '../common/text-input';
import { Competition } from '@/domain/types/competition';
import TextInputLarge from '../common/text-input-large';
import { CompetitionType } from '@/domain/enums/competition-type';
import ComboBox from '../common/combo-box';
import { menuCompTypes } from '@/domain/constants/menus/menu-comp-types';
import { EditorMode } from '@/domain/enums/editor-mode';
import { CompetitionGender } from '@/domain/enums/competition-gender';
import { menuCompGenders } from '@/domain/constants/menus/menu-comp-genders';
import { MaxAge } from '@/domain/enums/max-age';
import { menuMaxAge } from '@/domain/constants/menus/menu-max-age';
import { User } from '@/domain/types/user';
import UserCard from '../user/user-card';
import { getUsers } from '@/infrastructure/clients/user.client';
import ActionButton from '../common/action-button';
import { Action } from '@/domain/enums/action';
import { UserType } from '@/domain/enums/user-type';
import { useTranslations } from 'next-intl';
import CurInput from '../common/currency-input';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import CheckBox from '../common/check-box';
import { isNaturalPerson } from '@/functions/is-natural-person';
import { menuMaxAmountParticipants } from '@/domain/constants/menus/menu-max-amount-participants';
import { Event } from '@/domain/types/event';
import { cn } from '@/lib/utils';
import Separator from '../separator';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

const FIELD_ROW_CLASS =
  'grid min-w-0 grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] items-center gap-x-3 gap-y-1';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full';
const READONLY_VALUE_CLASS = 'min-w-0 text-sm text-foreground/90';

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={FIELD_ROW_CLASS}>
      <div className={FIELD_LABEL_CLASS}>{label}</div>
      <div className={FIELD_CONTROL_CLASS}>{children}</div>
    </div>
  );
}

interface ICompetitionEditorProps {
  event: Event;
  editorMode: EditorMode;
  comp?: Competition;
  onCompUpdate: (comp: Competition) => void;
}

const CompetitionEditor = ({ event, editorMode, comp, onCompUpdate }: ICompetitionEditorProps) => {
  const t = useTranslations('global/components/competition-editor');

  const [name, setCompName] = useState(comp?.name || '');
  const [compType, setCompType] = useState(comp?.type || CompetitionType.BATTLES);
  const [compGender, setCompGender] = useState(comp?.gender || CompetitionGender.MIXED);
  const [maxAge, setMaxAge] = useState<MaxAge>(comp?.maxAge || MaxAge.NONE);
  const [maxAmountParticipants, setMaxAmountParticipants] = useState(comp?.maxAmountParticipants || -1);
  const [isFollowUpCompetition, setIsFollowUpCompetition] = useState(!!comp?.isFollowUpCompetition);
  const [participationFee, setParticipationFee] = useState(comp?.participationFee || 0);
  const [description, setDescription] = useState(comp?.description || '');
  const [rules, setRules] = useState(comp?.rules || '');
  const [judges, setJudges] = useState<User[]>(comp?.judges || []);
  const [judgeToAddUsername, setJudgeToAddUsername] = useState<string>();
  const [users, setUsers] = useState<User[]>([]);

  const addJudge = (username: string) => {
    if (judges.some(j => j.username === username)) {
      console.error(`${username} already assigned in judges list.`);
      return;
    }
    const next = users.find(u => u.username === username);
    if (next) setJudges(prev => [...prev, next]);
  };

  const removeJudge = (judge: User) => {
    setJudges(prev => prev.filter(j => j !== judge));
  };

  const updateComp = () => {
    onCompUpdate({
      id: comp?.id,
      eventId: comp?.eventId,
      name,
      type: compType,
      gender: compGender,
      maxAge,
      maxAmountParticipants,
      isFollowUpCompetition,
      participationFee,
      participationFeeIncPaymentCosts: -1,
      description,
      rules,
      judges,
    });
  };

  const onParticipationFeeValueChange = (_v: string | undefined, _n: string | undefined, values?: { float: number | null; formatted: string; value: string }) => {
    if (values) {
      setParticipationFee(convertCurrencyDecimalToInteger(values.float || 0, event.currency));
    }
  };

  useEffect(() => {
    if (comp) {
      setCompName(comp.name);
      setCompType(comp.type);
      setCompGender(comp.gender);
      setMaxAge(comp.maxAge);
      setMaxAmountParticipants(comp.maxAmountParticipants);
      setIsFollowUpCompetition(comp.isFollowUpCompetition);
      setParticipationFee(comp.participationFee);
      setDescription(comp.description);
      setRules(comp.rules);
      setJudges(comp.judges);
    }

    getUsers().then(allUsers => {
      setUsers(allUsers.filter(u => u.type !== UserType.ADMINISTRATIVE && u.type !== UserType.FAN && isNaturalPerson(u.type)));
    });
  }, [comp]);

  useEffect(() => {
    updateComp();
  }, [name, compType, compGender, maxAge, maxAmountParticipants, isFollowUpCompetition, participationFee, description, rules, judges]);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput id="comp-name" label={t('inputName')} placeholder={t('inputNamePlaceHolder')} value={name} onChange={e => setCompName(e.currentTarget.value)} />

      <FieldRow label={t('cbType')}>
        {editorMode === EditorMode.CREATE ? (
          <ComboBox menus={menuCompTypes} value={compType} onChange={setCompType} />
        ) : (
          <div className={READONLY_VALUE_CLASS}>{menuCompTypes.find(m => m.value === compType)?.text}</div>
        )}
      </FieldRow>

      <FieldRow label={t('cbGender')}>
        {editorMode === EditorMode.CREATE ? (
          <ComboBox menus={menuCompGenders} value={compGender} onChange={setCompGender} />
        ) : (
          <div className={READONLY_VALUE_CLASS}>{menuCompGenders.find(m => m.value === compGender)?.text}</div>
        )}
      </FieldRow>

      <FieldRow label={t('cbMaxAge')}>
        <ComboBox menus={menuMaxAge} value={maxAge ? maxAge.toString() : menuMaxAge[0].value} searchEnabled={false} onChange={v => setMaxAge(+v)} />
      </FieldRow>

      <FieldRow label={t('cbMaxAmountParticipants')}>
        <ComboBox
          menus={menuMaxAmountParticipants}
          value={maxAmountParticipants ? String(maxAmountParticipants) : menuMaxAmountParticipants[0].value}
          searchEnabled={false}
          onChange={v => setMaxAmountParticipants(+v)}
        />
      </FieldRow>

      <CheckBox
        id="comp-follow-up"
        label={t('chbIsFollowUpComp')}
        value={isFollowUpCompetition}
        onChange={() => {
          setIsFollowUpCompetition(prev => {
            if (!prev) setParticipationFee(0);
            return !prev;
          });
        }}
      />

      {!isFollowUpCompetition && (
        <CurInput
          id="comp-participation-fee"
          label={`${t('inputPaticipantFee')} (${getCurrencySymbol(event.currency)})`}
          placeholder="15,00"
          value={convertCurrencyIntegerToDecimal(participationFee, event.currency)}
          onValueChange={onParticipationFeeValueChange}
        />
      )}

      <TextInputLarge
        id="comp-description"
        label={t('inputDescription')}
        placeholder={t('inputDescriptionPlaceHolder')}
        value={description}
        resizable
        onChange={e => setDescription(e.currentTarget.value)}
      />

      <TextInputLarge id="comp-rules" label={t('inputRules')} placeholder={t('inputRulesPlaceHolder')} value={rules} resizable onChange={e => setRules(e.currentTarget.value)} />

      <div className="py-1">
        <Separator />
      </div>

      <h2 className="text-sm font-semibold leading-tight text-foreground/90">{t('cbJudges')}</h2>

      <div className="flex min-w-0 flex-col gap-3">
        {judges.map((judge, index) => (
          <div key={`judge-${judge.username}-${index}`} className="flex min-w-0 items-center justify-between gap-2 py-0.5">
            <div className="min-w-0 flex-1">
              <UserCard user={judge} showUserCountryFlag={event.showUserCountryFlag} />
            </div>
            <ActionButton action={Action.DELETE} onClick={() => removeJudge(judge)} />
          </div>
        ))}

        <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:gap-2">
          <div className="min-w-0 w-full flex-1">
            <ComboBox menus={users.map(u => ({ text: `${u.firstName} (${u.username})`, value: u.username }))} value={judgeToAddUsername || ''} searchEnabled onChange={setJudgeToAddUsername} />
          </div>
          <div className="flex shrink-0 justify-end sm:pb-0.5">
            <ActionButton
              action={Action.ADD}
              onClick={() => {
                if (judgeToAddUsername) addJudge(judgeToAddUsername);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionEditor;
