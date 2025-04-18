'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import { Offering } from '@/types/offering';
import { imgImagePlaceholder, imgUserDefaultImg } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import CurInput from '../common/CurrencyInput';
import CheckBox from '../common/CheckBox';

interface IOfferingEditorProps {
  offering?: Offering;
  onOfferingUpdate: (offering: Offering) => void;
  onOfferingPreviewUpdate: (image: any) => void;
}

const OfferingEditor = ({ offering, onOfferingUpdate, onOfferingPreviewUpdate }: IOfferingEditorProps) => {
  const t = useTranslations('global/components/offering-editor');

  const [description, setOfferingDescription] = useState(offering?.description || '');
  const [cost, setCost] = useState(offering?.cost || 0.0);
  const [mandatoryForParticipant, setMandatoryForParticipant] = useState<boolean>(offering?.mandatoryForParticipant || false);
  const [includesShirt, setIncludesShirt] = useState<boolean>(offering?.includesShirt || false);
  const [imgPreview, setImgPreview] = useState<any>();
  const [imgPreviewObjectURL, setImgPreviewObjectURL] = useState('');

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImgPreview(i);
      setImgPreviewObjectURL(URL.createObjectURL(i));
    }
  };

  const updateOffering = () => {
    onOfferingUpdate({
      id: offering?.id,
      eventId: offering?.eventId,
      description: description,
      mandatoryForParticipant: mandatoryForParticipant,
      includesShirt: includesShirt,
      imageUrlPreview: offering?.imageUrlPreview,
      cost: cost,
      costIncPaymentCosts: -1,
    });
  };

  const handleCostChanged = (values: { float: number | null; formatted: string; value: string }) => {
    setCost(values.float || 0.0);
  };

  const updateOfferingPreview = () => {
    onOfferingPreviewUpdate(imgPreview);
  };

  // updates inputs with given offering
  useEffect(() => {
    if (offering) {
      setOfferingDescription(offering.description);
      setCost(offering.cost);
      setMandatoryForParticipant(offering.mandatoryForParticipant);
      setIncludesShirt(offering.includesShirt);
    }
  }, [offering]);

  // fires offering back
  useEffect(() => {
    updateOffering();
  }, [description, cost, mandatoryForParticipant, includesShirt]);

  // fires offering preview back
  useEffect(() => {
    updateOfferingPreview();
  }, [imgPreviewObjectURL]);

  return (
    <>
      <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
        <TextInput
          id={'description'}
          label={t('inputDescription')}
          placeholder="Welcome package"
          value={description}
          onChange={e => {
            setOfferingDescription(e.currentTarget.value);
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

        <CheckBox
          id={'mandatoryForParticipant'}
          label={`${t('inputMandatoryForParticipant')}`}
          value={mandatoryForParticipant}
          onChange={() => {
            setMandatoryForParticipant(!mandatoryForParticipant);
          }}
        />

        <CheckBox
          id={'includesShirt'}
          label={`${t('inputIncludesShirt')}`}
          value={includesShirt}
          onChange={() => {
            setIncludesShirt(!includesShirt);
          }}
        />

        <div className="flex justify-center m-2 gap-2">
          <img
            src={imgPreviewObjectURL ? imgPreviewObjectURL : offering?.imageUrlPreview ? offering.imageUrlPreview : imgImagePlaceholder}
            className="flex h-12 w-12 object-cover border border-primary"
          />

          <div className="flex justify-center items-center">
            <input type="file" onChange={uploadToClient} />
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferingEditor;
