import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase/config';
import type { SiteSettings } from '../types';
import { initialSettings } from '../lib/mockData';

const DOC_PATH = 'settings/site';
const LOCAL_STORAGE_KEY = 'studio_site_settings';

export const defaultSettings = initialSettings;

export const getSettings = async (): Promise<SiteSettings> => {
  // Read local storage cache first
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // If configured, try to fetch fresh from Firestore in background
      if (isConfigured) {
        try {
          const docRef = doc(db, DOC_PATH);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const data = { ...defaultSettings, ...snapshot.data() } as SiteSettings;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            return data;
          }
        } catch {
          // ignore background failure
        }
      }
      return { ...defaultSettings, ...parsed };
    }
  } catch {
    // localStorage error fallback
  }

  // If live Firebase configured, try fetching
  if (isConfigured) {
    try {
      const docRef = doc(db, DOC_PATH);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = { ...defaultSettings, ...snapshot.data() } as SiteSettings;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Firebase getSettings failed, using defaults:', e);
    }
  }

  // Initialize cache with default settings
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSettings));
  } catch {}

  return defaultSettings;
};

export const updateSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  const current = await getSettings();
  const updated: SiteSettings = { ...current, ...data };

  // Save to localStorage immediately and broadcast update
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('studio_settings_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }

  // Sync to Firebase if configured
  if (isConfigured) {
    try {
      const docRef = doc(db, DOC_PATH);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.warn('Firebase setDoc failed, saved locally:', e);
    }
  }
};
