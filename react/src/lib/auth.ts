const SESSION_KEY = 'ticketapp_session';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

export const saveSession = (session: Session): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): Session | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  
  const session = JSON.parse(sessionStr) as Session;
  if (session.expiresAt < Date.now()) {
    clearSession();
    return null;
  }
  
  return session;
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};
