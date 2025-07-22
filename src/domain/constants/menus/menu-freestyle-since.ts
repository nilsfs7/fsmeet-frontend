import { MenuItem } from '@/domain/types/menu-item';

const currentYear = new Date().getFullYear();

const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString());

const entries = Object.values(years).map((year: string) => {
  return {
    text: year,
    value: year,
  };
});

export const menuFreestyleSinceWithUnspecified: MenuItem[] = [{ text: 'not specified', value: '-1' }].concat(entries);
