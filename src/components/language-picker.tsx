'use client';

import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import ReactCountryFlag from 'react-country-flag';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getSupportedlanguages } from '../functions/get-supported-languages';

const LanguagePicker = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [locale, setLocale] = useState<string>('GB');
  const [opened, setOpened] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const supportedLanguages = getSupportedlanguages();

  useEffect(() => {
    const locale = getCookie('locale')?.toString();

    if (locale) {
      setLocale(locale.toUpperCase() || 'GB');
    }
  }, [locale]);

  const handleMenuClicked = () => {
    setOpened(!opened);
  };

  const handleLanguageChanged = (index: number) => {
    setLocale(supportedLanguages[index]);
    setCookie('locale', supportedLanguages[index]);
    setOpened(false);
    router.refresh();
  };

  return (
    <div className="relative">
      <div className="static flex h-14 w-14 p-1 items-center justify-center cursor-pointer rounded-lg border border-secondary-dark bg-secondary-light hover:border-primary">
        <button onClick={handleMenuClicked}>
          <div className="h-9 w-9 rounded-full border border-secondary-dark hover:border-primary">
            <ReactCountryFlag
              countryCode={locale}
              svg
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '9999px',
                objectFit: 'cover',
              }}
            />
          </div>
        </button>
      </div>

      {/* actions menu */}
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
        <div className={`absolute right-0 top-14 mt-2 w-14 rounded-lg border border-secondary-dark bg-secondary-light hover:border-primary`}>
          {supportedLanguages.map((language, index) => {
            return (
              <div
                key={index}
                className={`flex h-14 items-center justify-center cursor-pointer
                ${activeIndex === index ? 'bg-secondary' : ''} 
                ${index === 0 ? 'rounded-t-[8px]' : ''} 
                ${index === supportedLanguages.length - 1 ? 'rounded-b-[8px]' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                onClick={() => {
                  handleLanguageChanged(index);
                }}
              >
                <div className="h-9 w-9 rounded-full border border-secondary-dark hover:border-primary">
                  <ReactCountryFlag
                    countryCode={language}
                    svg
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '9999px',
                      objectFit: 'cover',
                    }}
                  />
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
