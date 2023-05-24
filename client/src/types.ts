export interface User {
  id: string;
  username: string;
  sessionID: string;
  userID: string;
  connected: boolean;
}

export interface PrivateMessage {
  from: string;
  content: string;
  username?: string;
  to: string;
}

export interface ChatMessage {
  timestamp: Date;
  content: string;
  from: string;
  username: string;
}
// TODO: Share types?