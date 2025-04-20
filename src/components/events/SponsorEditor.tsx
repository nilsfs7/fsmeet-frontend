'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Sponsor } from '@/types/sponsor';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/CheckBox';

interface ISponsorEditorProps {
  sponsor?: Sponsor;
  onSponsorUpdate: (sponsor: Sponsor) => void;
  onSponsorLogoUpdate: (image: any) => void;
}

const SponsorEditor = ({ sponsor, onSponsorUpdate, onSponsorLogoUpdate }: ISponsorEditorProps) => {
  const t = useTranslations('global/components/sponsor-editor');

  const [name, setSponsorName] = useState(sponsor?.name || '');
  const [website, setSponsorWebsite] = useState(sponsor?.website || '');
  const [imgLogo, setImgLogo] = useState<File>();
  const [imgLogoObjectURL, setImgLogoObjectURL] = useState<string>();
  const [isPublic, setIsPublic] = useState<boolean>(sponsor?.isPublic || true);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImgLogo(i);
      setImgLogoObjectURL(URL.createObjectURL(i));
    }
  };

  const updateSponsor = () => {
    onSponsorUpdate({
      id: sponsor?.id,
      eventId: sponsor?.eventId,
      name: name,
      website: website,
      imageUrlLogo: sponsor?.imageUrlLogo,
      isPublic: isPublic,
    });
  };

  const updateSponsorLogo = () => {
    onSponsorLogoUpdate(imgLogo);
  };

  // updates inputs with given sponsor
  useEffect(() => {
    if (sponsor) {
      setSponsorName(sponsor.name);
      setSponsorWebsite(sponsor.website);
      setIsPublic(sponsor.isPublic);
    }
  }, [sponsor]);

  // fires sponsor back
  useEffect(() => {
    updateSponsor();
  }, [name, website, isPublic]);

  // fires sponsor logo back
  useEffect(() => {
    updateSponsorLogo();
  }, [imgLogoObjectURL]);

  return (
    <>
      <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
        <TextInput
          id={'name'}
          label={t('inputName')}
          placeholder="PersianBall"
          value={name}
          onChange={e => {
            setSponsorName(e.currentTarget.value);
          }}
        />

        <TextInput
          id={'website'}
          label={t('inputWebsite')}
          placeholder="https://persianball.shop/"
          value={website}
          onChange={e => {
            setSponsorWebsite(e.currentTarget.value);
          }}
        />

        <div className="flex justify-center m-2 gap-2">
          <img
            src={imgLogoObjectURL ? imgLogoObjectURL : sponsor?.imageUrlLogo ? sponsor.imageUrlLogo : imgUserDefaultImg}
            className="flex h-12 w-12 rounded-full object-cover border border-primary"
          />

          <div className="flex justify-center items-center">
            <input type="file" onChange={uploadToClient} />
          </div>
        </div>

        <CheckBox
          id={'isPublicEnabled'}
          label={t('chbIsPublic')}
          value={isPublic}
          onChange={() => {
            setIsPublic(!isPublic);
          }}
        />
      </div>
    </>
  );
};

export default SponsorEditor;
