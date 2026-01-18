import { Platform } from '../../domain/enums/platform';

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-platform': Platform.WEB,
};
