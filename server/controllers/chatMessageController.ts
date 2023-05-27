import { ChatMessage } from "../types";
import { ChatMessageStore } from "../stores/chatMessageStore";

const chatMessageStore = new ChatMessageStore();

export const saveChatMessage = (message: ChatMessage): void => {
  chatMessageStore.saveMessage(message);
};

export const getAllChatMessages = (): ChatMessage[] => {
  return chatMessageStore.findAllMessages();
};
