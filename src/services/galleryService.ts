import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase/config';
import type { GallerySection } from '../types/gallery';
import { DEFAULT_GALLERY_SECTIONS } from '../types/gallery';

const COLLECTION = 'gallery_config';
const LOCAL_STORAGE_KEY = 'studio_gallery_config';

// ─── Local storage helpers ───────────────────────────────
const getLocalConfig = (): GallerySection[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GALLERY_SECTIONS));
    return DEFAULT_GALLERY_SECTIONS;
  } catch {
    return DEFAULT_GALLERY_SECTIONS;
  }
};

const saveLocalConfig = (sections: GallerySection[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sections));
    window.dispatchEvent(new CustomEvent('studio_gallery_updated'));
  } catch (e) {
    console.warn('Failed to save gallery config to localStorage:', e);
  }
};

// ─── Public API ──────────────────────────────────────────

export const getGallerySections = async (): Promise<GallerySection[]> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('sortOrder', 'asc'));
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore getGallerySections timeout')), 2500)
      );
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
      if (!snapshot.empty) {
        const sections = snapshot.docs.map((d) => ({
          ...d.data(),
          sectionId: d.id,
        })) as GallerySection[];
        saveLocalConfig(sections);
        return sections;
      }
    } catch (e) {
      console.warn('Firestore getGallerySections failed or timed out, using local:', e);
    }
  }
  return getLocalConfig();
};

export const getGallerySection = async (sectionId: string): Promise<GallerySection | null> => {
  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, sectionId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { ...snapshot.data(), sectionId: snapshot.id } as GallerySection;
      }
    } catch (e) {
      console.warn('Firestore getGallerySection failed, using local:', e);
    }
  }
  return getLocalConfig().find((s) => s.sectionId === sectionId) || null;
};

export const updateGallerySection = async (
  sectionId: string,
  data: Partial<GallerySection>
): Promise<void> => {
  // Update local immediately
  const sections = getLocalConfig();
  const idx = sections.findIndex((s) => s.sectionId === sectionId);
  if (idx !== -1) {
    sections[idx] = { ...sections[idx], ...data };
    saveLocalConfig(sections);
  }

  // Sync to Firebase
  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, sectionId);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.warn('Firestore updateGallerySection failed, saved locally:', e);
    }
  }
};

export const initializeGalleryConfig = async (): Promise<void> => {
  if (!isConfigured) return;

  try {
    const q = query(collection(db, COLLECTION));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed default gallery config into Firestore
      for (const section of DEFAULT_GALLERY_SECTIONS) {
        const docRef = doc(db, COLLECTION, section.sectionId);
        await setDoc(docRef, {
          ...section,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      console.log('Gallery config initialized in Firestore');
    }
  } catch (e) {
    console.warn('Failed to initialize gallery config:', e);
  }
};
