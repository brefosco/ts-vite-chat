import { ChatMessage } from "../types";

export class ChatMessageStore {
  messages: ChatMessage[];

  constructor() {
    this.messages = [];
  }

  saveMessage(message: ChatMessage) {
    this.messages.push(message);
  }

  findAllMessages() {
    return this.messages;
  }
}
