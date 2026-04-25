'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import TextInput from '../common/text-input';
import { Attachment } from '@/domain/types/attachment';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { DatePicker } from '../common/date-picker';
import moment, { type Moment } from 'moment';
import { getFilenameFromUrl, truncateString } from '@/functions/string-manipulation';
import { cn } from '@/lib/utils';
import Separator from '../separator';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

const FIELD_ROW_CLASS = 'flex min-w-0 flex-col gap-1.5 sm:grid sm:grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] sm:items-center sm:gap-3';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full sm:min-w-0';
const FIELD_CONTROL_TALL_INNER = 'flex min-h-10 w-full min-w-0 items-center';

const FILE_INPUT_CLASS =
  'w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground';

function expiryMoment(expiryDate: string | null | undefined): Moment | undefined {
  if (!expiryDate) {
    return undefined;
  }
  const m = moment(expiryDate);
  return m.isValid() ? m : undefined;
}

interface IAttachmentEditorProps {
  attachment?: Attachment;
  onAttachmentUpdate: (attachment: Attachment) => void;
  onAttachmentFileUpdate: (file: File) => void;
}

const AttachmentEditor = ({ attachment, onAttachmentUpdate, onAttachmentFileUpdate }: IAttachmentEditorProps) => {
  const t = useTranslations('global/components/attachment-editor');

  const [name, setAttachmentName] = useState(attachment?.name || '');
  const [isExternal, setIsExternal] = useState(!!attachment?.isExternal);
  const [url, setUrl] = useState<string | null>(attachment?.url || null);
  const [file, setFile] = useState<File>();
  const [fileObjectURL, setFileObjectURL] = useState<string>();
  const [expires, setExpires] = useState(!!attachment?.expires);
  const [expiryDate, setExpiryDate] = useState<string | null>(attachment?.expiryDate || null);
  const [enabled, setEnabled] = useState(attachment?.enabled ?? true);

  const uploadToClient = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const f = event.target.files[0];
      setFile(f);
      setFileObjectURL(URL.createObjectURL(f));
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

  const updateAttachmentFile = () => {
    if (file) {
      onAttachmentFileUpdate(file);
    }
  };

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

  useEffect(() => {
    updateAttachment();
  }, [name, isExternal, url, expires, expiryDate, enabled]);

  useEffect(() => {
    updateAttachmentFile();
  }, [fileObjectURL]);

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput
        id="attachment-name"
        label={t('inputName')}
        placeholder="Parental Form"
        value={name}
        onChange={e => setAttachmentName(e.currentTarget.value)}
      />

      <CheckBox id="attachment-external" label={t('chbIsExternal')} value={isExternal} onChange={() => setIsExternal(p => !p)} />

      {isExternal && (
        <TextInput
          id="attachment-url"
          label={t('inputUrl')}
          placeholder="https://dffb.org/form.pdf"
          value={url ?? ''}
          onChange={e => setUrl(e.currentTarget.value || null)}
        />
      )}

      {!isExternal && (
        <>
          <div className="py-1">
            <Separator />
          </div>
          <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
            {attachment?.url && (
              <div className="min-w-0 text-sm text-foreground/90 sm:max-w-[12rem]">
                {truncateString(getFilenameFromUrl(attachment.url), 3, 7)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <input type="file" className={FILE_INPUT_CLASS} onChange={uploadToClient} />
            </div>
          </div>
        </>
      )}

      <CheckBox id="attachment-expires" label={t('chbExpires')} value={expires} onChange={() => setExpires(p => !p)} />

      {expires && (
        <div className={FIELD_ROW_CLASS}>
          <div className={FIELD_LABEL_CLASS}>{t('datePickerExpiryDate')}</div>
          <div className={FIELD_CONTROL_CLASS}>
            <div className={FIELD_CONTROL_TALL_INNER}>
              <DatePicker
                date={expiryMoment(expiryDate)}
                fromDate={moment('2020')}
                toDate={moment().add(2, 'y')}
                onChange={value => {
                  if (value) {
                    setExpiryDate(value.startOf('day').utc().format());
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <CheckBox id="attachment-enabled" label={t('chbEnabled')} value={enabled} onChange={() => setEnabled(p => !p)} />
    </div>
  );
};

export default AttachmentEditor;
