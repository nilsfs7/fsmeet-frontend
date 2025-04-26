'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Accommodation } from '@/types/accommodation';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CurInput from '../common/CurrencyInput';
import CheckBox from '../common/CheckBox';

interface IAccommodationEditorProps {
  accommodation?: Accommodation;
  onAccommodationUpdate: (accommodation: Accommodation) => void;
  onAccommodationPreviewUpdate: (image: any) => void;
}

const AccommodationEditor = ({ accommodation, onAccommodationUpdate, onAccommodationPreviewUpdate }: IAccommodationEditorProps) => {
  const t = useTranslations('global/components/accommodation-editor');

  const [description, setAccommodationDescription] = useState(accommodation?.description || '');
  const [website, setAccommodationWebsite] = useState(accommodation?.website || '');
  const [cost, setCost] = useState(accommodation?.cost || 0.0);
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
      enabled: enabled,
    });
  };

  const handleCostChanged = (values: { float: number | null; formatted: string; value: string }) => {
    setCost(values.float || 0.0);
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
          value={website}
          onChange={e => {
            setAccommodationWebsite(e.currentTarget.value);
          }}
        />

        <CurInput
          id={'cost'}
          label={t('inputCost')}
          placeholder="35,00"
          value={cost}
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
