import { PrivateMessage } from "../types";

export class MessageStore {
  messages: PrivateMessage[];

  constructor() {
    this.messages = [];
  }

  saveMessage(message: PrivateMessage) {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string) {
    return this.messages.filter(
      (message) => message.from === userID || message.to === userID
    );
  }
}
