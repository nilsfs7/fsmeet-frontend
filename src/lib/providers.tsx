'use client';

import { ReactNode } from 'react';

interface ILocalizationProvider {
  children?: ReactNode;
}

export default function LocalizationProvider({ children }: ILocalizationProvider) {
  return <>{children}</>;
}
