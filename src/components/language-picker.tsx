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

const flagFrameClass =
  'flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/50 transition-colors hover:border-primary/50';
const flagStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '9999px',
  objectFit: 'cover',
};

const LanguagePicker = () => {
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
      <div
        className={cn(
          'static flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border border-border/60 p-1',
          'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
          'supports-[backdrop-filter]:bg-secondary-light/70',
          'transition-all duration-200',
          'hover:border-primary/50 hover:shadow-md',
          'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
          opened && 'border-primary/50 shadow-md',
        )}
      >
        <button
          type="button"
          aria-label="Language"
          aria-expanded={opened}
          aria-haspopup="listbox"
          onClick={handleMenuClicked}
          className="flex h-full w-full items-center justify-center"
        >
          <div className={flagFrameClass}>
            <ReactCountryFlag countryCode={locale} svg style={flagStyle} title="" />
          </div>
        </button>
      </div>

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
            'absolute right-0 top-14 z-50 mt-2 w-14 overflow-hidden rounded-xl border border-border/60',
            'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
            'supports-[backdrop-filter]:bg-secondary-light/70',
            'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
          )}
        >
          {supportedLanguages.map((language, index) => {
            return (
              <div
                key={`${language}-${index.toString()}`}
                className={cn(
                  'flex h-12 cursor-pointer items-center justify-center transition-colors',
                  'hover:bg-muted/50 dark:hover:bg-muted/30',
                  activeIndex === index && 'bg-muted/50 dark:bg-muted/30',
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
