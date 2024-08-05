export class ReadMatchSlotResponseDto {
  id: string;
  slotIndex: number;
  name: string;
  result?: number;

  constructor(id: string, slotIndex: number, name: string, result?: number) {
    this.id = id;
    this.slotIndex = slotIndex;
    this.name = name;
    this.result = result;
  }
}
