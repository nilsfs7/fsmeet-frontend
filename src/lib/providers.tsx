'use client';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider as LP } from '@mui/x-date-pickers';
import { ReactNode } from 'react';

interface ILocalizationProvider {
  children?: ReactNode;
}

// HINT: only used for Material UI timepicker
export default function LocalizationProvider({ children }: ILocalizationProvider) {
  return <LP dateAdapter={AdapterMoment}>{children}</LP>;
}
