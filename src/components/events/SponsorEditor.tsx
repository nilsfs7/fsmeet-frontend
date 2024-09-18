import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Sponsor } from '@/types/sponsor';

interface ISponsorEditorProps {
  sponsor?: Sponsor;
  onSponsorUpdate: (sponsor: Sponsor) => void;
}

const SponsorEditor = ({ sponsor, onSponsorUpdate }: ISponsorEditorProps) => {
  const [name, setSponsorName] = useState(sponsor?.name || '');
  const [website, setSponsorWebsite] = useState(sponsor?.website || '');

  const updateSponsor = () => {
    onSponsorUpdate({
      id: sponsor?.id,
      eventId: sponsor?.eventId,
      name: name,
      website: website,
    });
  };

  // updates inputs with given sponsor
  useEffect(() => {
    if (sponsor) {
      setSponsorName(sponsor.name);
      setSponsorWebsite(sponsor.website);
    }
  }, [sponsor]);

  // fires sponsor back
  useEffect(() => {
    updateSponsor();
  }, [name, website]);

  // if (!name) {
  //   return <LoadingSpinner />;
  // }

  return (
    <>
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

        <TextInput
          id={'website'}
          label={'Website'}
          placeholder="https://persianball.shop/"
          value={website}
          onChange={(e) => {
            setSponsorWebsite(e.currentTarget.value);
          }}
        />
      </div>
    </>
  );
};

export default SponsorEditor;
