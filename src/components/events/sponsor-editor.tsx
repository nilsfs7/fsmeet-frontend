'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import TextInput from '../common/text-input';
import { Sponsor } from '@/domain/types/sponsor';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { cn } from '@/lib/utils';
import Separator from '../separator';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
  '[&>div.m-2]:!m-0',
);

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
  const [isPublic, setIsPublic] = useState(sponsor?.isPublic ?? true);

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const f = event.target.files[0];
      setImgLogo(f);
      setImgLogoObjectURL(URL.createObjectURL(f));
    }
  };

  const updateSponsor = () => {
    onSponsorUpdate({
      id: sponsor?.id,
      eventId: sponsor?.eventId,
      name,
      website,
      imageUrlLogo: sponsor?.imageUrlLogo,
      isPublic,
    });
  };

  const updateSponsorLogo = () => {
    onSponsorLogoUpdate(imgLogo);
  };

  useEffect(() => {
    if (sponsor) {
      setSponsorName(sponsor.name);
      setSponsorWebsite(sponsor.website);
      setIsPublic(sponsor.isPublic);
    }
  }, [sponsor]);

  useEffect(() => {
    updateSponsor();
  }, [name, website, isPublic]);

  useEffect(() => {
    updateSponsorLogo();
  }, [imgLogoObjectURL]);

  const logoSrc = imgLogoObjectURL ?? (sponsor?.imageUrlLogo ? sponsor.imageUrlLogo : imgUserDefaultImg);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput
        id="sponsor-name"
        label={t('inputName')}
        placeholder="PersianBall"
        value={name}
        onChange={e => setSponsorName(e.currentTarget.value)}
      />

      <TextInput
        id="sponsor-website"
        label={t('inputWebsite')}
        placeholder="https://persianball.shop/"
        value={website}
        onChange={e => setSponsorWebsite(e.currentTarget.value)}
      />

      <div className="py-1">
        <Separator />
      </div>

      <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="shrink-0">
          <img src={logoSrc} alt="" className="h-12 w-12 rounded-full border border-border/60 object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            className="w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
            onChange={uploadToClient}
          />
        </div>
      </div>

      <CheckBox id="sponsor-is-public" label={t('chbIsPublic')} value={isPublic} onChange={() => setIsPublic(p => !p)} />
    </div>
  );
};

export default SponsorEditor;
