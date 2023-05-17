interface Session {
  id: string;
  username: string;
  sessionID: string;
  userID: string;
  connected: boolean;
}

export class SessionStore {
  sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: Session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }

  findSessionByUsername(username: string) {
    const sessionsArray = Array.from(this.sessions.values());
    return sessionsArray.find((session) => session.username === username);
  }
}
