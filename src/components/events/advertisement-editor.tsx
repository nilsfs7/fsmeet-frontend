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
import { FileDropzone } from '@/components/common/file-dropzone';
import TextInputLarge from '../common/text-input-large';

const SECTION_TITLE_CLASS = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground';

const EDITOR_CARD_CLASS = cn(
  'flex w-full min-w-0 flex-col',
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

  const selectImage = (f: File) => {
    setImgPreview(f);
    setImgPreviewObjectURL(URL.createObjectURL(f));
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
  const hasImage = previewSrc !== imgImagePlaceholder;
  const previewHost = (() => {
    try {
      return new URL(targetUrl).host.replace(/^www\./, '');
    } catch {
      return targetUrl;
    }
  })();

  return (
    <div className="grid w-full max-w-5xl min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
      <div className={EDITOR_CARD_CLASS}>
        <section className="flex flex-col gap-4">
          <h2 className={SECTION_TITLE_CLASS}>{t('sectionContent')}</h2>
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
        </section>

        <section className="flex flex-col gap-3 border-t border-border pt-4 sm:pt-5">
          <h2 className={SECTION_TITLE_CLASS}>{t('lblImage')}</h2>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
            <img
              src={previewSrc}
              alt=""
              className={cn('h-28 w-28 shrink-0 self-center rounded-2xl border border-border/60 bg-muted sm:self-auto', hasImage ? 'object-cover' : 'object-contain p-7 opacity-40 dark:invert')}
            />
            <FileDropzone
              className="min-w-0 flex-1"
              label={t('lblChooseImage')}
              hint={t('hintImage')}
              fileName={imgPreview?.name}
              accept="image/*"
              icon={<IconPhotoUp className="h-5 w-5" stroke={1.75} aria-hidden />}
              onFile={selectImage}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-border pt-4 sm:pt-5">
          <h2 className={SECTION_TITLE_CLASS}>{t('sectionVisibility')}</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="flex min-h-11 flex-1 items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
              <FieldLabel id="advertisement-display-order" label={t('inputDisplayOrder')} tooltip={t('tooltipDisplayOrder')} className="text-sm font-medium leading-none" />
              <Input
                className="h-9 w-20 shrink-0 text-right text-sm font-medium tabular-nums"
                id="advertisement-display-order"
                aria-label={t('inputDisplayOrder')}
                type="number"
                inputMode="numeric"
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
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-2 lg:sticky lg:top-0">
        <h2 className={cn(SECTION_TITLE_CLASS, 'px-1')}>{t('lblPreview')}</h2>
        <div className={cn('relative overflow-hidden rounded-2xl border border-dashed border-border bg-background shadow-xs', !enabled && 'opacity-60')}>
          <span className="absolute right-2 top-2 z-1 rounded-md bg-muted/90 px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide text-muted-foreground">{t('lblAdBadge')}</span>
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted/40">
            {/* eslint-disable-next-line @next/next/no-img-element -- live preview of a local object URL */}
            <img src={previewSrc} alt="" className={cn('h-full w-full', hasImage ? 'object-contain' : 'object-contain p-10 opacity-40 dark:invert')} />
          </div>
          <div className="flex flex-col gap-1 p-3">
            <p className={cn('line-clamp-2 font-semibold', title ? 'text-foreground' : 'text-muted-foreground')}>{title || t('placeholderTitle')}</p>
            <p className={cn('line-clamp-3 text-sm', description ? 'text-muted-foreground' : 'text-muted-foreground/60')}>{description || t('placeholderDescription')}</p>
            {previewHost && <p className="truncate pt-1 text-xs font-medium text-brand-strong">{previewHost}</p>}
          </div>
        </div>
        <p className="px-1 text-xs text-muted-foreground">{enabled ? t('hintPreview') : t('hintPreviewInactive')}</p>
      </aside>
    </div>
  );
};

export default AdvertisementEditor;
