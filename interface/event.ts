export interface IEvent {
  id: string;
  name: string;
  owner: string;
  dateFrom: number;
  dateTo: number;
  registrationCosts: number;
  registrationDeadline: number;
  description: string;
  location: string;
  type: string;
}
