import { RatingAction } from '@/domain/enums/rating-action';

export class CreatePollRatingBodyDto {
  ratingAction: RatingAction;

  constructor(ratingAction: RatingAction) {
    this.ratingAction = ratingAction;
  }
}
