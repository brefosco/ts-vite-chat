import { PrivateMessage } from "../types";
import { MessageStore } from "../stores/messageStore";

const messageStore = new MessageStore();

export const saveMessage = (message: PrivateMessage): void => {
  messageStore.saveMessage(message);
};

export const getMessagesForUser = (userID: string): PrivateMessage[] => {
  return messageStore.findMessagesForUser(userID);
};
