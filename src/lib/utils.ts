import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RemoveFunctions<T> = {
  [P in keyof T as T[P] extends Function ? never : P]: T[P];
};
