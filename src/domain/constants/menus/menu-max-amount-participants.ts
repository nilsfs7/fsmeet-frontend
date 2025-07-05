import { MenuItem } from '@/types/menu-item';
import { MaxAmountParticipants } from '@/domain/enums/max-amount-participants';

export const menuMaxAmountParticipants: MenuItem[] = [
  { text: 'None', value: MaxAmountParticipants.NONE.toString() },
  { text: '16', value: MaxAmountParticipants.SIXTEEN.toString() },
  { text: '20', value: MaxAmountParticipants.TWENTY.toString() },
  { text: '24', value: MaxAmountParticipants.TWENTYFOUR.toString() },
  { text: '32', value: MaxAmountParticipants.THRITYTWO.toString() },
  { text: '48', value: MaxAmountParticipants.FOURTYEIGTH.toString() },
  { text: '64', value: MaxAmountParticipants.SIXTYFOUR.toString() },
  { text: '96', value: MaxAmountParticipants.NINETYSIX.toString() },
  { text: '128', value: MaxAmountParticipants.HTWENTYEIGHT.toString() },
];
