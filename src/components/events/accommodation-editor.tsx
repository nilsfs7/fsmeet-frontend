'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import TextInput from '../common/text-input';
import { Accommodation } from '@/domain/types/accommodation';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CurInput from '../common/currency-input';
import CheckBox from '../common/check-box';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { cn } from '@/lib/utils';
import Separator from '../separator';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

interface IAccommodationEditorProps {
  currency: CurrencyCode;
  accommodation?: Accommodation;
  onAccommodationUpdate: (accommodation: Accommodation) => void;
  onAccommodationPreviewUpdate: (image: File) => void;
}

const AccommodationEditor = ({ currency, accommodation, onAccommodationUpdate, onAccommodationPreviewUpdate }: IAccommodationEditorProps) => {
  const t = useTranslations('global/components/accommodation-editor');

  const [description, setAccommodationDescription] = useState(accommodation?.description || '');
  const [website, setAccommodationWebsite] = useState<string | null>(accommodation?.website ?? null);
  const [cost, setCost] = useState(accommodation?.cost || 0);
  const [imgPreview, setImgPreview] = useState<File>();
  const [imgPreviewObjectURL, setImgPreviewObjectURL] = useState<string>();
  const [enabled, setEnabled] = useState(accommodation?.enabled ?? true);

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const f = event.target.files[0];
      setImgPreview(f);
      setImgPreviewObjectURL(URL.createObjectURL(f));
    }
  };

  const onCostValueChange = (
    _v: string | undefined,
    _n: string | undefined,
    values?: { float: number | null; formatted: string; value: string },
  ) => {
    if (values) {
      setCost(convertCurrencyDecimalToInteger(values.float || 0, currency));
    }
  };

  const updateAccommodation = () => {
    onAccommodationUpdate({
      id: accommodation?.id,
      eventId: accommodation?.eventId,
      description,
      website,
      imageUrlPreview: accommodation?.imageUrlPreview,
      cost,
      costIncPaymentCosts: -1,
      enabled,
    });
  };

  const updateAccommodationPreview = () => {
    if (imgPreview) {
      onAccommodationPreviewUpdate(imgPreview);
    }
  };

  useEffect(() => {
    if (accommodation) {
      setAccommodationDescription(accommodation.description);
      setAccommodationWebsite(accommodation.website);
      setCost(accommodation.cost);
      setEnabled(accommodation.enabled);
    }
  }, [accommodation]);

  useEffect(() => {
    updateAccommodation();
  }, [description, website, cost, enabled]);

  useEffect(() => {
    updateAccommodationPreview();
  }, [imgPreviewObjectURL]);

  const previewSrc = imgPreviewObjectURL ?? (accommodation?.imageUrlPreview ? accommodation.imageUrlPreview : imgImagePlaceholder);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput
        id="accommodation-description"
        label={t('inputDescription')}
        placeholder="4 Seasons - Junior Suite"
        value={description}
        onChange={e => setAccommodationDescription(e.currentTarget.value)}
      />

      <TextInput
        id="accommodation-website"
        label={t('inputWebsite')}
        placeholder="https://hotel.com/offering/123"
        value={website ?? ''}
        onChange={e => setAccommodationWebsite(e.currentTarget.value || null)}
      />

      <CurInput
        id="accommodation-cost"
        label={`${t('inputCost')} (${getCurrencySymbol(currency)})`}
        placeholder="35,00"
        value={convertCurrencyIntegerToDecimal(cost, currency)}
        onValueChange={onCostValueChange}
      />

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

      <CheckBox id="accommodation-enabled" label={t('chbEnabled')} value={enabled} onChange={() => setEnabled(p => !p)} />
    </div>
  );
};

export default AccommodationEditor;
