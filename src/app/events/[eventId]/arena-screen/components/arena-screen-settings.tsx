'use client';

import { Checkbox } from '@/components/ui/checkbox';
import TextButton from '@/components/common/text-button';
import { ButtonStyle } from '@/domain/enums/button-style';
import { getArenaScreen, updateArenaScreenBackgroundImage, upsertArenaScreen } from '@/infrastructure/clients/event.client';
import { ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';

export function ArenaScreenSettings({ eventId }: { eventId: string }) {
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
      toast.error(e instanceof Error ? e.message : 'Could not load arena screen settings.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaveSettings = async () => {
    if (status !== 'authenticated' || !session) {
      toast.error('Sign in to save arena screen settings.');
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
      toast.success('Arena screen settings saved.');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackgroundFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (status !== 'authenticated' || !session) {
      toast.error('Sign in to upload a background image.');
      return;
    }
    setUploadingBg(true);
    try {
      await updateArenaScreenBackgroundImage(eventId, file, session);
      toast.success('Background image updated.');
      const data = await getArenaScreen(eventId);
      setBackgroundPreviewUrl(data.style.backgroundImageUrl?.trim() ?? '');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <>
      <Toaster richColors />
      <section className="mt-10 rounded-lg border border-secondary-dark bg-secondary-light/30">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-lg p-4 text-left transition-colors hover:bg-secondary-light/50"
          onClick={() => setSettingsOpen(o => !o)}
          aria-expanded={settingsOpen}
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-primary">Display settings</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {loading ? 'Loading…' : settingsOpen ? 'Background image, overlay, and on-screen options.' : 'Background, overlay, labels, flags — click to edit.'}
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${settingsOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>

        {settingsOpen && (
          <div className="space-y-4 border-t border-secondary-dark px-4 pb-4 pt-2">
            {loading ? (
              <p className="py-4 text-sm text-muted-foreground">Loading settings…</p>
            ) : (
              <>
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Background image</p>
            {backgroundPreviewUrl ? (
              <div
                className="mb-3 h-24 w-full max-w-md rounded-md border border-secondary-dark bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundPreviewUrl})` }}
                role="img"
                aria-label="Current background preview"
              />
            ) : (
              <p className="mb-3 text-xs text-muted-foreground">No image set (solid backdrop in preview).</p>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBackgroundFile} />
            <TextButton
              text={uploadingBg ? 'Uploading…' : 'Choose image…'}
              disabled={uploadingBg || status !== 'authenticated'}
              onClick={() => fileInputRef.current?.click()}
            />
          </div>

          <div>
            <label htmlFor="arena-overlay" className="text-sm font-medium text-primary">
              Overlay darkness ({Math.round(backgroundOverlayOpacity * 100)}%)
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
              <Checkbox id="arena-show-pos" checked={showPositions} onCheckedChange={v => setShowPositions(v === true)} />
              <label htmlFor="arena-show-pos" className="text-sm text-primary">
                Show position labels
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="arena-rev-pos" checked={reversePositionLabels} onCheckedChange={v => setReversePositionLabels(v === true)} />
              <label htmlFor="arena-rev-pos" className="text-sm text-primary">
                Reverse position numbering
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="arena-flags" checked={showFlags} onCheckedChange={v => setShowFlags(v === true)} />
              <label htmlFor="arena-flags" className="text-sm text-primary">
                Show country flags
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="arena-lastname" checked={showLastName} onCheckedChange={v => setShowLastName(v === true)} />
              <label htmlFor="arena-lastname" className="text-sm text-primary">
                Show last names
              </label>
            </div>
          </div>

          <TextButton text={saving ? 'Saving…' : 'Save display settings'} disabled={saving || status !== 'authenticated'} style={ButtonStyle.DEFAULT} onClick={() => void handleSaveSettings()} />
          {status !== 'authenticated' && <p className="text-xs text-muted-foreground">Sign in to change arena settings.</p>}
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
}
