import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { EventCompetition } from '@/types/event-competition';
import TextInputLarge from '../common/TextInputLarge';

interface ICompetitionEditorProps {
  comp?: EventCompetition;
  onCompUpdate: (comp: EventCompetition) => void;
}

const CompetitionEditor = ({ comp, onCompUpdate }: ICompetitionEditorProps) => {
  const [name, setCompName] = useState(comp?.name || '');
  const [description, setDescription] = useState(comp?.description || '');
  const [rules, setRules] = useState(comp?.rules || '');

  const updateComp = () => {
    onCompUpdate({
      id: comp?.id,
      eventId: comp?.eventId,
      name: name,
      description: description,
      rules: rules,
    });
  };

  // updates inputs with given comp
  useEffect(() => {
    if (comp) {
      setCompName(comp.name);
      setDescription(comp.description);
      setRules(comp.rules);
    }
  }, [comp]);

  // fires comp back
  useEffect(() => {
    updateComp();
  }, [name, description, rules]);

  // if (!name) {
  //   return <>loading...</>;
  // }

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
      <TextInput
        id={'name'}
        label={'Competition Name'}
        placeholder="Male Battles"
        value={name}
        onChange={e => {
          setCompName(e.currentTarget.value);
        }}
      />

      <TextInputLarge
        id={'description'}
        label={'Description'}
        placeholder="Group stage (circles) and KO (Top 16)."
        value={description}
        resizable={true}
        onChange={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <TextInputLarge
        id={'rules'}
        label={'Rules'}
        placeholder="3 rounds, 30 seconds, 1 ball."
        value={rules}
        resizable={true}
        onChange={e => {
          setRules(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default CompetitionEditor;
