'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Accommodation } from '@/domain/types/accommodation';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CurInput from '../common/CurrencyInput';
import CheckBox from '../common/CheckBox';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';

interface IAccommodationEditorProps {
  currency: CurrencyCode;
  accommodation?: Accommodation;
  onAccommodationUpdate: (accommodation: Accommodation) => void;
  onAccommodationPreviewUpdate: (image: any) => void;
}

const AccommodationEditor = ({ currency, accommodation, onAccommodationUpdate, onAccommodationPreviewUpdate }: IAccommodationEditorProps) => {
  const t = useTranslations('global/components/accommodation-editor');

  const [description, setAccommodationDescription] = useState(accommodation?.description || '');
  const [website, setAccommodationWebsite] = useState(accommodation?.website || null);
  const [cost, setCost] = useState(accommodation?.cost || 0);
  const [imgPreview, setImgPreview] = useState<File>();
  const [imgPreviewObjectURL, setImgPreviewObjectURL] = useState<string>();
  const [enabled, setEnabled] = useState<boolean>(accommodation?.enabled || true);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImgPreview(i);
      setImgPreviewObjectURL(URL.createObjectURL(i));
    }
  };

  const updateAccommodation = () => {
    onAccommodationUpdate({
      id: accommodation?.id,
      eventId: accommodation?.eventId,
      description: description,
      website: website,
      imageUrlPreview: accommodation?.imageUrlPreview,
      cost: cost,
      costIncPaymentCosts: -1,
      enabled,
    });
  };

  const handleCostChanged = (values: { float: number | null; formatted: string; value: string }) => {
    setCost(convertCurrencyDecimalToInteger(values.float || 0, currency));
  };

  const handleWebsiteChanged = (value: string) => {
    if (!value) {
      setAccommodationWebsite(null);
    } else {
      setAccommodationWebsite(value);
    }
  };

  const updateAccommodationPreview = () => {
    onAccommodationPreviewUpdate(imgPreview);
  };

  // updates inputs with given accommodation
  useEffect(() => {
    if (accommodation) {
      setAccommodationDescription(accommodation.description);
      setAccommodationWebsite(accommodation.website);
      setCost(accommodation.cost);
      setEnabled(accommodation.enabled);
    }
  }, [accommodation]);

  // fires accommodation back
  useEffect(() => {
    updateAccommodation();
  }, [description, website, cost, enabled]);

  // fires accommodation preview back
  useEffect(() => {
    updateAccommodationPreview();
  }, [imgPreviewObjectURL]);

  return (
    <>
      <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
        <TextInput
          id={'description'}
          label={t('inputDescription')}
          placeholder="4 Seasons - Junior Suite"
          value={description}
          onChange={e => {
            setAccommodationDescription(e.currentTarget.value);
          }}
        />

        <TextInput
          id={'website'}
          label={t('inputWebsite')}
          placeholder="https://hotel.com/offering/123"
          value={website || undefined}
          onChange={e => {
            handleWebsiteChanged(e.currentTarget.value);
          }}
        />

        <CurInput
          id={'cost'}
          label={`${t('inputCost')} (${getCurrencySymbol(currency)})`}
          placeholder="35,00"
          value={convertCurrencyIntegerToDecimal(cost, currency)}
          onValueChange={(value, name, values) => {
            if (values) handleCostChanged(values);
          }}
        />

        <div className="flex justify-center m-2 gap-2">
          <img
            src={imgPreviewObjectURL ? imgPreviewObjectURL : accommodation?.imageUrlPreview ? accommodation.imageUrlPreview : imgImagePlaceholder}
            className="flex h-12 w-12 object-cover border border-primary"
          />

          <div className="flex justify-center items-center">
            <input type="file" onChange={uploadToClient} />
          </div>
        </div>

        <CheckBox
          id={'enabled'}
          label={t('chbEnabled')}
          value={enabled}
          onChange={() => {
            setEnabled(!enabled);
          }}
        />
      </div>
    </>
  );
};

export default AccommodationEditor;
