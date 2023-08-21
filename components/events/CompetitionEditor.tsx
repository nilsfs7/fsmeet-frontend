import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { EventCompetition } from '@/types/event-competition';

interface ICompetitionEditorProps {
  comp?: EventCompetition;
  onCompUpdate: (comp: EventCompetition) => void;
}

const CompetitionEditor = ({ comp, onCompUpdate }: ICompetitionEditorProps) => {
  const [name, setCompName] = useState(comp?.name);

  const updateComp = () => {
    onCompUpdate({
      id: comp?.id,
      eventId: comp?.eventId,
      name: name,
    });
  };

  // updates inputs with given comp
  useEffect(() => {
    if (comp) {
      setCompName(comp.name);
    }
  }, [comp]);

  // fires comp back
  useEffect(() => {
    updateComp();
  }, [name]);

  if (!name) {
    return 'loading...';
  }

  return (
    <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
      <TextInput
        id={'name'}
        label={'Competition Name'}
        placeholder="Men Battles"
        value={name}
        onChange={e => {
          setCompName(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default CompetitionEditor;
