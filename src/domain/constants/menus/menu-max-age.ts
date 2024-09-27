import { MenuItem } from '@/types/menu-item';
import { MaxAge } from '@/domain/enums/max-age';

export const menuMaxAge: MenuItem[] = [
  { text: 'None', value: MaxAge.NONE.toString() },
  { text: '12', value: MaxAge.TWELVE.toString() },
  { text: '14', value: MaxAge.FOURTEEN.toString() },
  { text: '16', value: MaxAge.SIXTEEN.toString() },
  { text: '18', value: MaxAge.EIGHTEEN.toString() },
  { text: '20', value: MaxAge.TWENTY.toString() },
];
