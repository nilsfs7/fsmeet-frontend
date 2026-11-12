'use client';

import { useEffect, useRef, useState } from 'react';
import TextInput from '../common/text-input';
import { Sponsor } from '@/domain/types/sponsor';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { cn } from '@/lib/utils';
import { FileDropzone } from '../common/file-dropzone';
import { IconPhotoUp } from '@tabler/icons-react';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs sm:gap-5 sm:p-6',
  'dark:border-border/50 dark:bg-background/60 dark:supports-backdrop-filter:bg-background/50',
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

  const uploadToClient = (f: File) => {
    setImgLogo(f);
    setImgLogoObjectURL(URL.createObjectURL(f));
  };

  const updateSponsor = () => {
    onSponsorUpdate({
      id: sponsor?.id,
      eventId: sponsor?.eventId,
      index: sponsor?.index,
      name,
      website,
      imageUrlLogo: sponsor?.imageUrlLogo,
      isPublic,
    });
  };

  const updateSponsorLogo = () => {
    onSponsorLogoUpdate(imgLogo);
  };

  const hydratedSponsorId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!sponsor?.id || hydratedSponsorId.current === sponsor.id) return;
    hydratedSponsorId.current = sponsor.id;
    setSponsorName(sponsor.name);
    setSponsorWebsite(sponsor.website);
    setIsPublic(sponsor.isPublic);
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
      <TextInput id="sponsor-name" label={t('inputName')} placeholder="PersianBall" value={name} onChange={e => setSponsorName(e.currentTarget.value)} />

      <TextInput id="sponsor-website" label={t('inputWebsite')} placeholder="https://persianball.shop/" value={website} onChange={e => setSponsorWebsite(e.currentTarget.value)} />

      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-sm font-medium leading-none">{t('lblLogo')}</span>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
          <img src={logoSrc} alt="" className="h-24 w-24 shrink-0 self-center rounded-2xl border border-border/60 bg-muted object-cover sm:self-auto" />
          <FileDropzone label={t('lblChooseLogo')} hint={t('hintLogo')} fileName={imgLogo?.name} accept="image/*" icon={<IconPhotoUp stroke={1.75} aria-hidden />} onFile={uploadToClient} />
        </div>
      </div>

      <CheckBox id="sponsor-is-public" label={t('chbIsPublic')} value={isPublic} onChange={() => setIsPublic(p => !p)} />
    </div>
  );
};

export default SponsorEditor;
