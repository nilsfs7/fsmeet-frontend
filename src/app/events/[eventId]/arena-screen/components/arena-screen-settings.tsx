'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { getArenaScreen, updateArenaScreenBackgroundImage, upsertArenaScreen } from '@/infrastructure/clients/event.client';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';

export function ArenaScreenSettings({ eventId }: { eventId: string }) {
  const t = useTranslations('/events/eventid/arena-screen');
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState(0.5);
  const [showPositions, setShowPositions] = useState(true);
  const [reversePositionLabels, setReversePositionLabels] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [showLastName, setShowLastName] = useState(true);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getArenaScreen(eventId);
      const s = data.style;
      setBackgroundOverlayOpacity(typeof s.backgroundOverlayOpacity === 'number' ? s.backgroundOverlayOpacity : 0.5);
      setShowPositions(s.showPositions ?? true);
      setReversePositionLabels(s.reversePositionLabels ?? false);
      setShowFlags(s.showFlags ?? true);
      setShowLastName(s.showLastName ?? true);
      setBackgroundPreviewUrl(s.backgroundImageUrl?.trim() ?? '');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('errorLoadSettings'));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaveSettings = async () => {
    if (status !== 'authenticated' || !session) {
      toast.error(t('errorSignInSave'));
      return;
    }
    setSaving(true);
    try {
      const latest = await getArenaScreen(eventId);
      const activeMatchId = latest.activeMatch?.id ?? null;
      await upsertArenaScreen(
        eventId,
        activeMatchId,
        backgroundOverlayOpacity,
        showPositions,
        reversePositionLabels,
        showFlags,
        showLastName,
        session,
      );
      toast.success(t('toastSaved'));
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleBackgroundFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (status !== 'authenticated' || !session) {
      toast.error(t('errorSignInUpload'));
      return;
    }
    setUploadingBg(true);
    try {
      await updateArenaScreenBackgroundImage(eventId, file, session);
      toast.success(t('toastBackground'));
      const data = await getArenaScreen(eventId);
      setBackgroundPreviewUrl(data.style.backgroundImageUrl?.trim() ?? '');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errorUpload'));
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <>
      <Toaster richColors />
      <section className="mt-10 rounded-2xl border border-border bg-background shadow-xs">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-lg p-4 text-left transition-colors hover:bg-secondary-light/50"
          onClick={() => setSettingsOpen(o => !o)}
          aria-expanded={settingsOpen}
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-primary">{t('settingsTitle')}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {loading ? t('settingsLoading') : settingsOpen ? t('settingsSummaryOpen') : t('settingsSummaryClosed')}
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${settingsOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>

        {settingsOpen && (
          <div className="space-y-4 border-t border-border px-4 pb-4 pt-2">
            {loading ? (
              <p className="py-4 text-sm text-muted-foreground">{t('loadingSettings')}</p>
            ) : (
              <>
          <div>
            <p className="mb-2 text-sm font-medium text-primary">{t('backgroundImage')}</p>
            {backgroundPreviewUrl ? (
              <div
                className="mb-3 h-24 w-full max-w-md rounded-md border border-border bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundPreviewUrl})` }}
                role="img"
                aria-label={t('backgroundPreview')}
              />
            ) : (
              <p className="mb-3 text-xs text-muted-foreground">{t('noImage')}</p>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBackgroundFile} />
            <Button
              type="button"
              variant="action"
              className={ctaActionButtonClassName}
              disabled={uploadingBg || status !== 'authenticated'}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingBg ? t('uploading') : t('chooseImage')}
            </Button>
          </div>

          <div>
            <label htmlFor="arena-overlay" className="text-sm font-medium text-primary">
              {t('overlay', { percent: Math.round(backgroundOverlayOpacity * 100) })}
            </label>
            <input
              id="arena-overlay"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={backgroundOverlayOpacity}
              onChange={ev => setBackgroundOverlayOpacity(Number(ev.target.value))}
              className="mt-2 block w-full max-w-md accent-primary"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="arena-show-pos"
                checked={showPositions}
                onCheckedChange={v => {
                  const on = v === true;
                  setShowPositions(on);
                }}
              />
              <label htmlFor="arena-show-pos" className="text-sm text-primary">
                {t('showPositions')}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="arena-rev-pos"
                checked={reversePositionLabels}
                disabled={!showPositions}
                onCheckedChange={v => setReversePositionLabels(v === true)}
              />
              <label
                htmlFor="arena-rev-pos"
                className={cn('text-sm text-primary', !showPositions && 'cursor-not-allowed opacity-50')}
              >
                {t('reversePositions')}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="arena-flags" checked={showFlags} onCheckedChange={v => setShowFlags(v === true)} />
              <label htmlFor="arena-flags" className="text-sm text-primary">
                {t('showFlags')}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="arena-lastname" checked={showLastName} onCheckedChange={v => setShowLastName(v === true)} />
              <label htmlFor="arena-lastname" className="text-sm text-primary">
                {t('showLastName')}
              </label>
            </div>
          </div>

          <Button
            type="button"
            variant="action"
            className={ctaActionButtonClassName}
            disabled={saving || status !== 'authenticated'}
            onClick={() => void handleSaveSettings()}
          >
            {saving ? t('saving') : t('saveSettings')}
          </Button>
          {status !== 'authenticated' && <p className="text-xs text-muted-foreground">{t('signInSettings')}</p>}
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
}
