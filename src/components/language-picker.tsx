'use client';

import { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import ReactCountryFlag from 'react-country-flag';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { getSupportedlanguages } from '../functions/get-supported-languages';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

const flagFrameClass =
  'flex h-6 w-6 items-center justify-center overflow-hidden rounded-full ring-1 ring-border';
const flagStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '9999px',
  objectFit: 'cover',
};

const LanguagePicker = () => {
  const t = useTranslations('global/ui');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [locale, setLocale] = useState<string>('GB');
  const [opened, setOpened] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const supportedLanguages = getSupportedlanguages();

  useEffect(() => {
    const c = getCookie('locale')?.toString();
    if (c) {
      setLocale(c.toUpperCase() || 'GB');
    }
  }, []);

  useEffect(() => {
    if (!opened) return;
    const onPointerDown = (event: PointerEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(event.target as Node)) {
        setOpened(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [opened]);

  const handleMenuClicked = () => {
    setOpened(v => !v);
  };

  const handleLanguageChanged = (index: number) => {
    setLocale(supportedLanguages[index]);
    setCookie('locale', supportedLanguages[index]);
    setOpened(false);
    void router.refresh();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={t('language')}
        aria-expanded={opened}
        aria-haspopup="listbox"
        onClick={handleMenuClicked}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-xs transition-all duration-150',
          'hover:border-foreground/20 hover:shadow-sm',
          opened && 'border-foreground/20 shadow-sm',
        )}
      >
        <div className={flagFrameClass}>
          <ReactCountryFlag countryCode={locale} svg style={flagStyle} title="" />
        </div>
      </button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={opened}
      >
        <div
          role="listbox"
          className={cn(
            'absolute right-0 top-12 z-50 grid w-[7.5rem] grid-cols-3 gap-1 overflow-hidden rounded-2xl border border-border bg-background p-1.5 shadow-lg',
          )}
        >
          {supportedLanguages.map((language, index) => {
            return (
              <div
                key={`${language}-${index.toString()}`}
                className={cn(
                  'flex h-9 cursor-pointer items-center justify-center rounded-lg transition-colors',
                  'hover:bg-muted',
                  (activeIndex === index || language === locale) && 'bg-muted',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                onClick={() => {
                  handleLanguageChanged(index);
                }}
                role="option"
                aria-selected={language === locale}
              >
                <div className={flagFrameClass}>
                  <ReactCountryFlag countryCode={language} svg style={flagStyle} title="" />
                </div>
              </div>
            );
          })}
        </div>
      </Transition>
    </div>
  );
};

export default LanguagePicker;
