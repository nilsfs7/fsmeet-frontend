'use client';

import { useEffect, useState } from 'react';
import TextInput from '../common/text-input';
import { Attachment } from '@/domain/types/attachment';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { DatePicker } from '../common/date-picker';
import moment from 'moment';
import { getFilenameFromUrl, truncateString } from '@/functions/string-manipulation';

interface IAttachmentEditorProps {
  attachment?: Attachment;
  onAttachmentUpdate: (attachment: Attachment) => void;
  onAttachmentDocumentUpdate: (file: File) => void;
}

const AttachmentEditor = ({ attachment, onAttachmentUpdate, onAttachmentDocumentUpdate }: IAttachmentEditorProps) => {
  const t = useTranslations('global/components/attachment-editor');

  const [name, setAttachmentName] = useState(attachment?.name || '');
  const [isExternal, setIsExternal] = useState<boolean>(attachment?.isExternal || false);
  const [url, setUrl] = useState<string | null>(attachment?.url || null);
  const [document, setDocument] = useState<File>();
  const [documentObjectURL, setDocumentObjectURL] = useState<string>();
  const [expires, setExpires] = useState<boolean>(attachment?.expires || false);
  const [expiryDate, setExpiryDate] = useState<string>(attachment?.expiryDate || '');
  const [enabled, setEnabled] = useState<boolean>(attachment?.enabled || true);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setDocument(i);
      setDocumentObjectURL(URL.createObjectURL(i));
    }
  };

  const updateAttachment = () => {
    onAttachmentUpdate({
      id: attachment?.id,
      eventId: attachment?.eventId,
      name,
      isExternal,
      url,
      expires,
      expiryDate,
      enabled,
    });
  };

  const updateAttachmentDocument = () => {
    if (document) {
      onAttachmentDocumentUpdate(document);
    }
  };

  // updates inputs with given attachment
  useEffect(() => {
    if (attachment) {
      setAttachmentName(attachment.name);
      setIsExternal(attachment.isExternal);
      setUrl(attachment.url || null);
      setExpires(attachment.expires);
      setExpiryDate(attachment.expiryDate);
      setEnabled(attachment.enabled);
    }
  }, [attachment]);

  // fires attachment back
  useEffect(() => {
    updateAttachment();
  }, [name, isExternal, url, expires, expiryDate, enabled]);

  // fires attachment document back
  useEffect(() => {
    updateAttachmentDocument();
  }, [documentObjectURL]);

  return (
    <>
      <div className="m-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
        <TextInput
          id={'name'}
          label={t('inputName')}
          placeholder="Parental Form"
          value={name}
          onChange={e => {
            setAttachmentName(e.currentTarget.value);
          }}
        />

        <CheckBox
          id={'isExternal'}
          label={t('chbIsExternal')}
          value={isExternal}
          onChange={() => {
            setIsExternal(!isExternal);
          }}
        />

        {isExternal && (
          <TextInput
            id={'url'}
            label={t('inputUrl')}
            placeholder="https://dffb.org/form.pdf"
            value={url || undefined}
            onChange={e => {
              setUrl(e.currentTarget.value);
            }}
          />
        )}

        {!isExternal && (
          <div className="flex justify-center m-2 items-center gap-2">
            {attachment?.url && <div>{truncateString(getFilenameFromUrl(attachment.url), 3, 7)}</div>}

            <div className="flex justify-center items-center">
              <input type="file" onChange={uploadToClient} />
            </div>
          </div>
        )}

        <CheckBox
          id={'expires'}
          label={t('chbExpires')}
          value={expires}
          onChange={() => {
            setExpires(!expires);
          }}
        />

        {expires && (
          <div className="m-2 grid grid-cols-2 items-center gap-2">
            <div>{t('datePickerExpiryDate')}</div>
            <DatePicker
              date={moment(expiryDate)}
              fromDate={moment('2020')}
              toDate={moment().add(2, 'y')}
              onChange={value => {
                if (value) {
                  setExpiryDate(value.startOf('day').utc().format());
                }
              }}
            />
          </div>
        )}

        <CheckBox
          id={'isEnabled'}
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

export default AttachmentEditor;
