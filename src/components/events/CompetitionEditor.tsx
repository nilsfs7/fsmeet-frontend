import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Competition } from '@/types/competition';
import TextInputLarge from '../common/TextInputLarge';
import { CompetitionType } from '@/domain/enums/competition-type';
import ComboBox from '../common/ComboBox';
import { menuCompTypes } from '@/domain/constants/menus/menu-comp-types';
import { EditorMode } from '@/domain/enums/editor-mode';
import { CompetitionGender } from '@/domain/enums/competition-gender';
import { menuCompGenders } from '@/domain/constants/menus/menu-comp-genders';
import { MaxAge } from '@/domain/enums/max-age';
import { menuMaxAge } from '@/domain/constants/menus/menu-max-age';
import { User } from '@/types/user';
import UserCard from '../user/UserCard';
import { getUsers } from '@/infrastructure/clients/user.client';
import ActionButton from '../common/ActionButton';
import { Action } from '@/domain/enums/action';
import { UserType } from '@/domain/enums/user-type';
import { useTranslations } from 'next-intl';
import CurInput from '../common/CurrencyInput';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import CheckBox from '../common/CheckBox';
import { isNaturalPerson } from '@/functions/is-natural-person';

interface ICompetitionEditorProps {
  editorMode: EditorMode;
  currency: CurrencyCode;
  comp?: Competition;
  onCompUpdate: (comp: Competition) => void;
}

const CompetitionEditor = ({ editorMode, currency, comp, onCompUpdate }: ICompetitionEditorProps) => {
  const t = useTranslations('global/components/competition-editor');

  const [name, setCompName] = useState(comp?.name || '');
  const [compType, setCompType] = useState(comp?.type || CompetitionType.BATTLES);
  const [compGender, setCompGender] = useState(comp?.gender || CompetitionGender.MIXED);
  const [maxAge, setMaxAge] = useState<MaxAge>(comp?.maxAge || MaxAge.NONE);
  const [isFollowUpCompetition, setIsFollowUpCompetition] = useState<boolean>(comp?.isFollowUpCompetition || false);
  const [participationFee, setParticipationFee] = useState(comp?.participationFee || 0);
  const [description, setDescription] = useState(comp?.description || '');
  const [rules, setRules] = useState(comp?.rules || '');
  const [judges, setJudges] = useState<User[]>(comp?.judges || []);
  const [judgeToAddUsername, setJudgeToAddUsername] = useState<string>();
  const [users, setUsers] = useState<User[]>([]);

  const handleAddJudgeClicked = async (username: string) => {
    // check if judge is already in array
    const judgesMatching = judges.filter(user => {
      if (user.username === username) {
        return user;
      }
    });

    if (judgesMatching.length > 0) {
      console.error(`${username} already assigned in judges list.`);
    } else {
      try {
        const judge = users.filter(user => {
          if (user.username === username) {
            return user;
          }
        })[0];

        const newArray = Array.from(judges);
        newArray.push(judge);
        setJudges(newArray);
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const handleDeleteJudgeClicked = async (judge: User) => {
    try {
      const newArray = Array.from(judges);
      const index = newArray.indexOf(judge);
      newArray.splice(index, 1);
      setJudges(newArray);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const updateComp = () => {
    onCompUpdate({
      id: comp?.id,
      eventId: comp?.eventId,
      name: name,
      type: compType,
      gender: compGender,
      maxAge: maxAge,
      isFollowUpCompetition: isFollowUpCompetition,
      participationFee: participationFee,
      participationFeeIncPaymentCosts: -1,
      description: description,
      rules: rules,
      judges: judges,
    });
  };

  const handleParticipationFeeChanged = (values: { float: number | null; formatted: string; value: string }) => {
    setParticipationFee(convertCurrencyDecimalToInteger(values.float || 0, currency));
  };

  // updates inputs with given comp
  useEffect(() => {
    if (comp) {
      setCompName(comp.name);
      setCompType(comp.type);
      setCompGender(comp.gender);
      setMaxAge(comp.maxAge);
      setIsFollowUpCompetition(comp.isFollowUpCompetition);
      setParticipationFee(comp.participationFee);
      setDescription(comp.description);
      setRules(comp.rules);
      setJudges(comp.judges);
    }

    getUsers().then(users => {
      users = users.filter(user => {
        if (user.type !== UserType.TECHNICAL && user.type !== UserType.FAN && isNaturalPerson(user.type)) return user;
      });
      setUsers(users);
    });
  }, [comp]);

  // fires comp back
  useEffect(() => {
    updateComp();
  }, [name, compType, compGender, maxAge, isFollowUpCompetition, participationFee, description, rules, judges]);

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
      <TextInput
        id={'name'}
        label={t('inputName')}
        placeholder={t('inputNamePlaceHolder')}
        value={name}
        onChange={e => {
          setCompName(e.currentTarget.value);
        }}
      />

      <div className="m-2 grid grid-cols-2 items-center">
        <div>{t('cbType')}</div>

        <div className="flex w-full">
          {editorMode === EditorMode.CREATE && (
            <ComboBox
              menus={menuCompTypes}
              value={compType}
              onChange={(value: CompetitionType) => {
                setCompType(value);
              }}
            />
          )}
          {editorMode === EditorMode.EDIT && <div>{menuCompTypes.find(item => item.value === compType)?.text}</div>}
        </div>
      </div>

      <div className="m-2 grid grid-cols-2 items-center">
        <div>{t('cbGender')}</div>

        <div className="flex w-full">
          {editorMode === EditorMode.CREATE && (
            <ComboBox
              menus={menuCompGenders}
              value={compGender}
              onChange={(value: CompetitionGender) => {
                setCompGender(value);
              }}
            />
          )}
          {editorMode === EditorMode.EDIT && <div>{menuCompGenders.find(item => item.value === compGender)?.text}</div>}
        </div>
      </div>

      <div className="m-2 grid grid-cols-2 items-center">
        <div>{t('cbMaxAge')}</div>
        <div className="flex w-full">
          <ComboBox
            menus={menuMaxAge}
            value={maxAge ? maxAge.toString() : menuMaxAge[0].value}
            searchEnabled={false}
            onChange={(value: any) => {
              setMaxAge(+value);
            }}
          />
        </div>
      </div>

      <CheckBox
        id={'paymentMethodCashEnabled'}
        label={t('chbIsFollowUpComp')}
        value={isFollowUpCompetition}
        onChange={() => {
          setIsFollowUpCompetition(!isFollowUpCompetition);

          if (!isFollowUpCompetition === true) {
            setParticipationFee(0);
          }
        }}
      />

      {!isFollowUpCompetition && (
        <CurInput
          id={'participationFee'}
          label={`${t('inputPaticipantFee')} (${getCurrencySymbol(currency)})`}
          placeholder="15,00"
          value={convertCurrencyIntegerToDecimal(participationFee, currency)}
          onValueChange={(value, name, values) => {
            if (values) handleParticipationFeeChanged(values);
          }}
        />
      )}

      <TextInputLarge
        id={'description'}
        label={t('inputDescription')}
        placeholder={t('inputDescriptionPlaceHolder')}
        value={description}
        resizable={true}
        onChange={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <TextInputLarge
        id={'rules'}
        label={t('inputRules')}
        placeholder={t('inputRulesPlaceHolder')}
        value={rules}
        resizable={true}
        onChange={e => {
          setRules(e.currentTarget.value);
        }}
      />

      <div className="flex h-[100%] flex-col p-2">
        <div>{t('cbJudges')}</div>

        <div className="flex h-full">
          <div className="flex flex-col w-full">
            {judges.map((judge, index) => {
              return (
                <div key={`${judge}-${index}`} className="flex justify-between p-1 gap-2">
                  <UserCard user={judge} />
                  <ActionButton
                    action={Action.DELETE}
                    onClick={() => {
                      handleDeleteJudgeClicked(judge);
                    }}
                  />
                </div>
              );
            })}

            <div className="flex justify-between p-1 gap-2">
              <ComboBox
                menus={users.map(user => {
                  return { text: `${user.firstName} (${user.username})`, value: user.username };
                })}
                value={judgeToAddUsername || ''}
                searchEnabled={true}
                onChange={(value: string) => {
                  setJudgeToAddUsername(value);
                }}
              />

              <ActionButton
                action={Action.ADD}
                onClick={() => {
                  if (judgeToAddUsername) {
                    handleAddJudgeClicked(judgeToAddUsername);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionEditor;
