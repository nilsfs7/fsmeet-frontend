import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Competition } from '@/types/competition';
import TextInputLarge from '../common/TextInputLarge';
import { CompetitionType } from '@/types/enums/competition-type';
import ComboBox from '../common/ComboBox';
import { menuCompTypes } from '@/types/consts/menus/menu-comp-types';
import { EditorMode } from '@/types/enums/editor-mode';
import { CompetitionGender } from '@/types/enums/competition-gender';
import { menuCompGenders } from '@/types/consts/menus/menu-comp-genders';

interface ICompetitionEditorProps {
  editorMode: EditorMode;
  comp?: Competition;
  onCompUpdate: (comp: Competition) => void;
}

const CompetitionEditor = ({ editorMode, comp, onCompUpdate }: ICompetitionEditorProps) => {
  const [name, setCompName] = useState(comp?.name || '');
  const [compType, setCompType] = useState(comp?.type || CompetitionType.BATTLES);
  const [compGender, setCompGender] = useState(comp?.gender || CompetitionGender.MIXED);
  const [description, setDescription] = useState(comp?.description || '');
  const [rules, setRules] = useState(comp?.rules || '');

  const updateComp = () => {
    onCompUpdate({
      id: comp?.id,
      eventId: comp?.eventId,
      name: name,
      type: compType,
      gender: compGender,
      description: description,
      rules: rules,
    });
  };

  // updates inputs with given comp
  useEffect(() => {
    if (comp) {
      setCompName(comp.name);
      setCompType(comp.type);
      setCompGender(comp.gender);
      setDescription(comp.description);
      setRules(comp.rules);
    }
  }, [comp]);

  // fires comp back
  useEffect(() => {
    updateComp();
  }, [name, compType, compGender, description, rules]);

  // if (!name) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
      <TextInput
        id={'name'}
        label={'Competition Name'}
        placeholder="Male Battles"
        value={name}
        onChange={(e) => {
          setCompName(e.currentTarget.value);
        }}
      />

      <div className="m-2 grid grid-cols-2">
        <div>{`Type`}</div>

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
          {editorMode === EditorMode.EDIT && <div>{menuCompTypes.find((item) => item.value === compType)?.text}</div>}
        </div>
      </div>

      <div className="m-2 grid grid-cols-2">
        <div>{`Gender`}</div>

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
          {editorMode === EditorMode.EDIT && <div>{menuCompGenders.find((item) => item.value === compGender)?.text}</div>}
        </div>
      </div>

      <TextInputLarge
        id={'description'}
        label={'Description'}
        placeholder="Group stage (circles) and KO (Top 16)."
        value={description}
        resizable={true}
        onChange={(e) => {
          setDescription(e.currentTarget.value);
        }}
      />

      <TextInputLarge
        id={'rules'}
        label={'Rules'}
        placeholder="3 rounds, 30 seconds, 1 ball."
        value={rules}
        resizable={true}
        onChange={(e) => {
          setRules(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default CompetitionEditor;
