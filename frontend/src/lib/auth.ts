export interface User {
  id: string;
  email: string;
  username: string;
  role: 'INTERVIEWER' | 'CANDIDATE';
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token');
  }
}

export function setUser(user: User) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function logout() {
  removeToken();
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('user');
  }
}
