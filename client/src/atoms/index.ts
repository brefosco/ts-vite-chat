import { atom } from 'jotai'
import { ChatMessage, PrivateMessage, User } from '../types';

export const messagesAtom = atom<ChatMessage[]>([]);
export const privateMessagesAtom = atom<PrivateMessage[]>([]);
export const usersAtom = atom<User[]>([]);
export const usernameAtom = atom("");
export const messageAtom = atom("");
export const privateMessageAtom = atom("");
export const recipientAtom = atom("");
export const isUsernameSelectedAtom = atom<boolean>(false);
