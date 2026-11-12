'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import TextInput from '../common/text-input';
import { Advertisement } from '@/domain/types/advertisement';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { cn } from '@/lib/utils';
import { IconPhotoUp } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { FieldLabel } from '@/components/common/field-label';
import TextInputLarge from '../common/text-input-large';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs sm:gap-5 sm:p-6',
  'dark:border-border/50 dark:bg-background/60 dark:supports-backdrop-filter:bg-background/50',
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

      <TextInput
        id="advertisement-target-url"
        label={t('inputTargetUrl')}
        placeholder="https://"
        value={targetUrl}
        labelTooltip={t('tooltipTargetUrl')}
        onChange={e => setTargetUrl(e.currentTarget.value)}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium leading-none">{t('lblImage')}</span>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
          <img
            src={previewSrc}
            alt=""
            className={cn(
              'h-28 w-28 shrink-0 self-center rounded-2xl border border-border/60 bg-muted sm:self-auto',
              previewSrc === imgImagePlaceholder ? 'object-contain p-7 opacity-40 dark:invert' : 'object-cover',
            )}
          />
          <label
            className={cn(
              'flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border px-4 py-5 text-center transition-colors',
              'hover:border-brand/50 hover:bg-brand-soft/30 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30',
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
              <IconPhotoUp className="h-5 w-5" stroke={1.75} aria-hidden />
            </span>
            <span className="max-w-full truncate text-sm font-semibold text-foreground">{imgPreview ? imgPreview.name : t('lblChooseImage')}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={uploadToClient} />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <FieldLabel id="advertisement-display-order" label={t('inputDisplayOrder')} tooltip={t('tooltipDisplayOrder')} className="text-sm font-medium leading-none" />
          <Input
            className="h-9 w-20 shrink-0 text-right text-sm font-medium tabular-nums"
            id="advertisement-display-order"
            aria-label={t('inputDisplayOrder')}
            type="number"
            placeholder="0"
            min={0}
            max={99}
            value={displayOrder}
            onChange={onDisplayOrderChange}
          />
        </div>
        <div className="sm:w-48">
          <CheckBox id="advertisement-enabled" label={t('chbEnabled')} value={enabled} onChange={() => setEnabled(p => !p)} />
        </div>
      </div>
    </div>
  );
};

export default AdvertisementEditor;
