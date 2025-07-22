import { MenuItem } from '@/domain/types/menu-item';
import { MaxAge } from '@/domain/enums/max-age';

export const menuMaxAge: MenuItem[] = [
  { text: 'None', value: MaxAge.NONE.toString() },
  { text: '12', value: MaxAge.TWELVE.toString() },
  { text: '13', value: MaxAge.THIRTEEN.toString() },
  { text: '14', value: MaxAge.FOURTEEN.toString() },
  { text: '15', value: MaxAge.FIFTEEN.toString() },
  { text: '16', value: MaxAge.SIXTEEN.toString() },
  { text: '17', value: MaxAge.SEVENTEEN.toString() },
  { text: '18', value: MaxAge.EIGHTEEN.toString() },
  { text: '19', value: MaxAge.NINETEEN.toString() },
  { text: '20', value: MaxAge.TWENTY.toString() },
];
