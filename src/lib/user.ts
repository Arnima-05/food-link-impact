export type UserRole = 'ngo' | 'restaurant';

export interface CurrentUser {
  id: string;
  role: UserRole;
  profile?: {
    full_name?: string;
    email?: string;
    location?: string;
    phone?: string;
  };
}

const KEY = 'foodlink_user';

export function getCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: CurrentUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function ensureUserOrRedirect(role: UserRole): CurrentUser | null {
  const u = getCurrentUser();
  if (!u || u.role !== role) return null;
  return u;
}

