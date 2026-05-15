'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import TextInput from '../common/text-input';
import { Advertisement } from '@/domain/types/advertisement';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { cn } from '@/lib/utils';
import Separator from '../separator';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TextInputLarge from '../common/text-input-large';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

interface AdvertisementEditorProps {
  advertisement?: Advertisement;
  username: string;
  onAdvertisementUpdate: (advertisement: Advertisement) => void;
  onAdvertisementImageUpdate: (image: File) => void;
}

const AdvertisementEditor = ({ advertisement, username, onAdvertisementUpdate, onAdvertisementImageUpdate }: AdvertisementEditorProps) => {
  const t = useTranslations('global/components/advertisement-editor');

  const [title, setTitle] = useState(advertisement?.title ?? '');
  const [description, setDescription] = useState(advertisement?.description ?? '');
  const [targetUrl, setTargetUrl] = useState(advertisement?.targetUrl ?? '');
  const [displayOrder, setDisplayOrder] = useState(String(Math.max(0, advertisement?.displayOrder ?? 0)));
  const [imgPreview, setImgPreview] = useState<File>();
  const [imgPreviewObjectURL, setImgPreviewObjectURL] = useState<string>();
  const [enabled, setEnabled] = useState(advertisement?.enabled ?? true);

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const f = event.target.files[0];
      setImgPreview(f);
      setImgPreviewObjectURL(URL.createObjectURL(f));
    }
  };

  const parseDisplayOrder = (raw: string): number => {
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, n);
  };

  const onDisplayOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.currentTarget.value;
    if (raw === '') {
      setDisplayOrder('');
      return;
    }
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) {
      setDisplayOrder('');
      return;
    }
    setDisplayOrder(String(Math.max(0, n)));
  };

  const pushAdvertisement = () => {
    onAdvertisementUpdate({
      id: advertisement?.id,
      title,
      description,
      targetUrl,
      imageUrl: advertisement?.imageUrl,
      displayOrder: parseDisplayOrder(displayOrder),
      enabled,
      username,
    });
  };

  const pushImage = () => {
    if (imgPreview) {
      onAdvertisementImageUpdate(imgPreview);
    }
  };

  useEffect(() => {
    pushAdvertisement();
  }, [title, description, targetUrl, displayOrder, enabled, username]);

  useEffect(() => {
    pushImage();
  }, [imgPreviewObjectURL]);

  const previewSrc = imgPreviewObjectURL ?? (advertisement?.imageUrl ? advertisement.imageUrl : imgImagePlaceholder);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput id="advertisement-title" label={t('inputTitle')} placeholder={t('placeholderTitle')} value={title} onChange={e => setTitle(e.currentTarget.value)} />
      <TextInputLarge
        id={'description'}
        label={t('inputDescription')}
        placeholder={t('placeholderDescription')}
        value={description}
        resizable={true}
        onChange={e => {
          setDescription(e.currentTarget.value);
        }}
      />

      <TextInput id="advertisement-target-url" label={t('inputTargetUrl')} placeholder="https://" value={targetUrl} labelTooltip={t('tooltipTargetUrl')} onChange={e => setTargetUrl(e.currentTarget.value)} />

      <div className="grid grid-cols-2 items-start gap-x-2 gap-y-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <label
                htmlFor="advertisement-display-order"
                className="cursor-help pt-2 text-sm font-medium leading-none underline decoration-dotted decoration-muted-foreground underline-offset-2"
              >
                {t('inputDisplayOrder')}
              </label>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-left">
              <p>{t('tooltipDisplayOrder')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          className={cn('h-9 w-[4.5rem] shrink-0 text-right text-sm font-medium tabular-nums', 'border-border/60 bg-background/80 shadow-sm hover:border-primary/50 dark:bg-background/50')}
          id={`advertisement-display-order`}
          type="number"
          placeholder="0"
          min={0}
          max={99}
          value={displayOrder}
          onChange={onDisplayOrderChange}
        />
      </div>

      <div className="py-1">
        <Separator />
      </div>
      <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="shrink-0">
          <img src={previewSrc} alt="" className="h-12 w-12 rounded-lg border border-border/60 object-cover" />
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
      <CheckBox id="advertisement-enabled" label={t('chbEnabled')} value={enabled} onChange={() => setEnabled(p => !p)} />
    </div>
  );
};

export default AdvertisementEditor;
