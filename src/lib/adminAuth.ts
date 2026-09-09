/**
 * File-based admin authentication (implemented in code on purpose, as
 * requested by the project owner, so developers can log in easily).
 *
 * Default credentials: test@gmail.com / test@123
 * Override them with VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD environment variables.
 *
 * NOTE: this is a convenience gate for the admin UI — it is NOT server-side
 * security. Data protection relies on the Firestore security rules and the
 * restricted (unsigned, PDF/image-only) Cloudinary upload preset.
 */
const SESSION_STORAGE_KEY = 'completestudy-admin-session';

const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'test@gmail.com';
const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'test@123';

export interface AdminSession {
  email: string;
  loginAt: number;
}

export function adminLogin(email: string, password: string): boolean {
  const emailMatches = email.trim().toLowerCase() === DEFAULT_ADMIN_EMAIL.trim().toLowerCase();
  const passwordMatches = password === DEFAULT_ADMIN_PASSWORD;
  if (emailMatches && passwordMatches) {
    const session: AdminSession = { email: DEFAULT_ADMIN_EMAIL, loginAt: Date.now() };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // storage unavailable — session simply won't persist
    }
    return true;
  }
  return false;
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed && typeof parsed.email === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function adminLogout(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
