'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import TextInput from '../common/text-input';
import { Offering } from '@/domain/types/offering';
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

interface IOfferingEditorProps {
  currency: CurrencyCode;
  offering?: Offering;
  onOfferingUpdate: (offering: Offering) => void;
  onOfferingPreviewUpdate: (image: any) => void;
}

const OfferingEditor = ({ currency, offering, onOfferingUpdate, onOfferingPreviewUpdate }: IOfferingEditorProps) => {
  const t = useTranslations('global/components/offering-editor');

  const [description, setOfferingDescription] = useState(offering?.description || '');
  const [cost, setCost] = useState(offering?.cost || 0);
  const [mandatoryForParticipant, setMandatoryForParticipant] = useState(!!offering?.mandatoryForParticipant);
  const [includesShirt, setIncludesShirt] = useState(!!offering?.includesShirt);
  const [imgPreview, setImgPreview] = useState<File>();
  const [imgPreviewObjectURL, setImgPreviewObjectURL] = useState<string>();
  const [enabled, setEnabled] = useState(offering?.enabled ?? true);

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

  const updateOffering = () => {
    onOfferingUpdate({
      id: offering?.id,
      eventId: offering?.eventId,
      description,
      mandatoryForParticipant,
      includesShirt,
      imageUrlPreview: offering?.imageUrlPreview,
      cost,
      costIncPaymentCosts: -1,
      enabled,
    });
  };

  const updateOfferingPreview = () => {
    onOfferingPreviewUpdate(imgPreview);
  };

  useEffect(() => {
    if (offering) {
      setOfferingDescription(offering.description);
      setCost(offering.cost);
      setMandatoryForParticipant(offering.mandatoryForParticipant);
      setIncludesShirt(offering.includesShirt);
      setEnabled(offering.enabled);
    }
  }, [offering]);

  useEffect(() => {
    updateOffering();
  }, [description, cost, mandatoryForParticipant, includesShirt, enabled]);

  useEffect(() => {
    updateOfferingPreview();
  }, [imgPreviewObjectURL]);

  const imageSrc = imgPreviewObjectURL ?? (offering?.imageUrlPreview ? offering.imageUrlPreview : imgImagePlaceholder);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput
        id="offering-description"
        label={t('inputDescription')}
        placeholder="Welcome package"
        value={description}
        onChange={e => setOfferingDescription(e.currentTarget.value)}
      />

      <CurInput
        id="offering-cost"
        label={`${t('inputCost')} (${getCurrencySymbol(currency)})`}
        placeholder="35,00"
        value={convertCurrencyIntegerToDecimal(cost, currency)}
        onValueChange={onCostValueChange}
      />

      <CheckBox
        id="offering-mandatory"
        label={t('inputMandatoryForParticipant')}
        value={mandatoryForParticipant}
        onChange={() => setMandatoryForParticipant(v => !v)}
      />

      <CheckBox id="offering-includes-shirt" label={t('inputIncludesShirt')} value={includesShirt} onChange={() => setIncludesShirt(v => !v)} />

      <div className="py-1">
        <Separator />
      </div>

      <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="shrink-0">
          <img
            src={imageSrc}
            alt=""
            className="h-12 w-12 rounded-lg border border-border/60 object-cover"
          />
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

      <CheckBox id="offering-enabled" label={t('chbEnabled')} value={enabled} onChange={() => setEnabled(v => !v)} />
    </div>
  );
};

export default OfferingEditor;
