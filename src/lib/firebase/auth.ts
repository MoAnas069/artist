import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, isConfigured } from './config';

const DEMO_AUTH_KEY = 'studio_admin_demo_auth';

// Custom event for demo auth state changes
const authChangeListeners: Array<(user: User | null) => void> = [];

export const isDemoAuthenticated = (): boolean => {
  return localStorage.getItem(DEMO_AUTH_KEY) === 'true';
};

export const getDemoUser = (): User | null => {
  if (isDemoAuthenticated()) {
    return {
      uid: 'demo-admin-uid',
      email: 'admin@studio.com',
      displayName: 'Studio Administrator',
    } as unknown as User;
  }
  return null;
};

export const signIn = async (email: string, password: string): Promise<User | void> => {
  const trimmedEmail = email.trim().toLowerCase();

  // If live Firebase is configured, authenticate with real Firebase Auth first
  if (isConfigured) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem(DEMO_AUTH_KEY);
      return cred.user;
    } catch (err: unknown) {
      // If live authentication fails but user provided fallback demo credentials, allow demo access
      if ((trimmedEmail === 'admin@studio.com' || trimmedEmail === 'admin@example.com' || trimmedEmail === 'admin') && (password === 'admin123' || password === 'AdminPassword123!')) {
        localStorage.setItem(DEMO_AUTH_KEY, 'true');
        const demoUser = getDemoUser();
        authChangeListeners.forEach((cb) => cb(demoUser));
        return;
      }
      const firebaseErr = err as { code?: string; message?: string };
      if (firebaseErr.code === 'auth/invalid-credential' || firebaseErr.code === 'auth/user-not-found') {
        throw new Error('Invalid email or password. Sign in with admin@studio.com / admin123.');
      }
      throw new Error(firebaseErr.message || 'Authentication failed.');
    }
  }

  // If not configured, allow demo sign-in
  if (password.length >= 4) {
    localStorage.setItem(DEMO_AUTH_KEY, 'true');
    const demoUser = getDemoUser();
    authChangeListeners.forEach((cb) => cb(demoUser));
    return;
  }
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem(DEMO_AUTH_KEY);
  authChangeListeners.forEach((cb) => cb(null));
  if (isConfigured) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore signOut errors
    }
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  authChangeListeners.push(callback);

  // If user is already authenticated via demo session, notify immediately
  if (isDemoAuthenticated()) {
    callback(getDemoUser());
  }

  // If not configured, we're in pure demo mode
  if (!isConfigured) {
    if (!isDemoAuthenticated()) {
      callback(null);
    }
    return () => {
      const idx = authChangeListeners.indexOf(callback);
      if (idx !== -1) authChangeListeners.splice(idx, 1);
    };
  }

  // Otherwise listen to real Firebase Auth
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user || getDemoUser());
  });

  return () => {
    unsubscribe();
    const idx = authChangeListeners.indexOf(callback);
    if (idx !== -1) authChangeListeners.splice(idx, 1);
  };
};
