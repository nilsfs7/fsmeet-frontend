'use client';

import { useEffect, useRef, useState } from 'react';
import TextInput from '../common/text-input';
import { Attachment } from '@/domain/types/attachment';
import { useTranslations } from 'next-intl';
import CheckBox from '../common/check-box';
import { DatePicker } from '../common/date-picker';
import moment, { type Moment } from 'moment';
import { getFilenameFromUrl, truncateString } from '@/functions/string-manipulation';
import { cn } from '@/lib/utils';
import { FileDropzone } from '../common/file-dropzone';
import { IconFileUpload, IconLink, IconPaperclip } from '@tabler/icons-react';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs sm:gap-5 sm:p-6',
  'dark:border-border/50 dark:bg-background/60 dark:supports-backdrop-filter:bg-background/50',
);

const FIELD_ROW_CLASS = 'grid min-w-0 grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:items-center sm:gap-x-4';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-tight text-foreground/80';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full';
const FIELD_CONTROL_TALL_INNER = 'flex min-h-10 w-full min-w-0 items-center';

const SECTION_TITLE_CLASS = 'text-xs font-semibold uppercase tracking-wide text-muted-foreground';

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

  const uploadToClient = (f: File) => {
    setFile(f);
    setFileObjectURL(URL.createObjectURL(f));
  };

  const updateAttachment = () => {
    onAttachmentUpdate({
      id: attachment?.id,
      eventId: attachment?.eventId,
      index: attachment?.index,
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

  const hydratedAttachmentId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!attachment?.id || hydratedAttachmentId.current === attachment.id) return;
    hydratedAttachmentId.current = attachment.id;
    setAttachmentName(attachment.name);
    setIsExternal(attachment.isExternal);
    setUrl(attachment.url || null);
    setExpires(attachment.expires);
    setExpiryDate(attachment.expiryDate);
    setEnabled(attachment.enabled);
  }, [attachment]);

  useEffect(() => {
    updateAttachment();
  }, [name, isExternal, url, expires, expiryDate, enabled]);

  useEffect(() => {
    updateAttachmentFile();
  }, [fileObjectURL]);

  const sourceOptions = [
    { external: false, label: t('optSourceFile'), Icon: IconFileUpload },
    { external: true, label: t('optSourceLink'), Icon: IconLink },
  ];

  return (
    <div className={EDITOR_CARD_CLASS}>
      <TextInput id="attachment-name" label={t('inputName')} placeholder="Parental Form" value={name} onChange={e => setAttachmentName(e.currentTarget.value)} />

      <div className="flex min-w-0 flex-col gap-3">
        <span className={SECTION_TITLE_CLASS}>{t('sectionSource')}</span>
        {/* Same state as the former "Is external link" checkbox */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="radiogroup" aria-label={t('sectionSource')}>
          {sourceOptions.map(option => {
            const active = isExternal === option.external;
            return (
              <button
                key={String(option.external)}
                type="button"
                role="radio"
                aria-checked={active}
                id={option.external ? 'attachment-external' : undefined}
                onClick={() => setIsExternal(option.external)}
                className={cn(
                  'flex min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <option.Icon className="h-4 w-4 shrink-0" stroke={1.75} aria-hidden />
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>

        {isExternal && <TextInput id="attachment-url" label={t('inputUrl')} placeholder="https://dffb.org/form.pdf" value={url ?? ''} onChange={e => setUrl(e.currentTarget.value || null)} />}

        {!isExternal && (
          <div className="flex min-w-0 flex-col gap-2">
            {attachment?.url && !attachment.isExternal && (
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
                <IconPaperclip className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.75} aria-hidden />
                <span className="text-muted-foreground">{t('lblCurrentFile')}</span>
                <span className="min-w-0 truncate font-medium text-foreground" title={getFilenameFromUrl(attachment.url)}>
                  {truncateString(getFilenameFromUrl(attachment.url), 3, 7)}
                </span>
              </div>
            )}
            <FileDropzone
              label={attachment?.url && !attachment.isExternal ? t('lblReplaceFile') : t('lblChooseFile')}
              hint={t('hintDropFile')}
              fileName={file?.name}
              icon={<IconFileUpload stroke={1.75} aria-hidden />}
              onFile={uploadToClient}
            />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <span className={SECTION_TITLE_CLASS}>{t('sectionAvailability')}</span>
        <CheckBox id="attachment-enabled" label={t('chbEnabled')} value={enabled} onChange={() => setEnabled(p => !p)} />
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
      </div>
    </div>
  );
};

export default AttachmentEditor;
