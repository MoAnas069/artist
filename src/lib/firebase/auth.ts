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
  // If not configured, allow demo credentials
  if (!isConfigured) {
    const validEmails = ['admin@studio.com', 'admin@example.com', 'admin'];
    const isValidDemoEmail = validEmails.includes(email.trim().toLowerCase()) || email.includes('@');
    const isValidDemoPass = password.length >= 4;

    if (isValidDemoEmail && isValidDemoPass) {
      localStorage.setItem(DEMO_AUTH_KEY, 'true');
      const demoUser = getDemoUser();
      authChangeListeners.forEach((cb) => cb(demoUser));
      return;
    }
    throw new Error('Invalid email or password. Use demo credentials.');
  }

  // Live Firebase auth
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem(DEMO_AUTH_KEY);
  authChangeListeners.forEach((cb) => cb(null));
  if (isConfigured) {
    await firebaseSignOut(auth);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  authChangeListeners.push(callback);

  // If in demo mode, notify immediately with demo user state
  if (!isConfigured) {
    callback(getDemoUser());
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
