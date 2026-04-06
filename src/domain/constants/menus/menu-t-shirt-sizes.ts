import { MenuItem } from '@/domain/types/menu-item';
import { TShirtSize } from '../../enums/t-shirt-size';

export const menuTShirtSizesWithUnspecified: MenuItem[] = [
  { text: 'not specified', value: '--' },
  { text: TShirtSize.XS, value: TShirtSize.XS },
  { text: TShirtSize.S, value: TShirtSize.S },
  { text: TShirtSize.M, value: TShirtSize.M },
  { text: TShirtSize.L, value: TShirtSize.L },
  { text: TShirtSize.XL, value: TShirtSize.XL },
  { text: TShirtSize.XXL, value: TShirtSize.XXL },
  { text: TShirtSize.XXXL, value: TShirtSize.XXXL },
];
