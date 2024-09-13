import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Sponsor } from '@/types/sponsor';

interface ISponsorEditorProps {
  sponsor?: Sponsor;
  onSponsorUpdate: (sponsor: Sponsor) => void;
}

const SponsorEditor = ({ sponsor, onSponsorUpdate }: ISponsorEditorProps) => {
  const [name, setSponsorName] = useState(sponsor?.name || '');

  const updateSponsor = () => {
    onSponsorUpdate({
      id: sponsor?.id,
      eventId: sponsor?.eventId,
      name: name,
    });
  };

  // updates inputs with given sponsor
  useEffect(() => {
    if (sponsor) {
      setSponsorName(sponsor.name);
    }
  }, [sponsor]);

  // fires sponsor back
  useEffect(() => {
    updateSponsor();
  }, [name]);

  // if (!name) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
      <TextInput
        id={'name'}
        label={'Sponsor Name'}
        placeholder="PersianBall"
        value={name}
        onChange={(e) => {
          setSponsorName(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default SponsorEditor;
