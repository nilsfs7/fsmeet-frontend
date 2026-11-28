export class ReadEventFeedbackUserResponseDto {
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}

export class ReadEventFeedbackResponseDto {
  id: string;
  message: string;
  /** ISO 8601 timestamp */
  createdAt: string;
  user: ReadEventFeedbackUserResponseDto;

  constructor(id: string, message: string, createdAt: string, user: ReadEventFeedbackUserResponseDto) {
    this.id = id;
    this.message = message;
    this.createdAt = createdAt;
    this.user = user;
  }
}
