import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase/config';
import type { Artwork, ArtworkFormData } from '../types';
import { initialArtworks } from '../lib/mockData';

const COLLECTION = 'artworks';
const LOCAL_STORAGE_KEY = 'studio_artworks_data';

// Helper to get local artworks
const getLocalArtworks = (): Artwork[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialArtworks));
    return initialArtworks;
  } catch {
    return initialArtworks;
  }
};

const saveLocalArtworks = (artworks: Artwork[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(artworks));
    window.dispatchEvent(new CustomEvent('studio_artworks_updated'));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

export const getPublishedArtworks = async (): Promise<Artwork[]> => {
  if (isConfigured) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Artwork));
      }
    } catch (e) {
      console.warn('Firestore getPublishedArtworks failed, using local:', e);
    }
  }
  return getLocalArtworks()
    .filter((a) => a.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getAllArtworks = async (): Promise<Artwork[]> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Artwork));
      }
    } catch (e) {
      console.warn('Firestore getAllArtworks failed, using local:', e);
    }
  }
  return getLocalArtworks().sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getFeaturedArtworks = async (): Promise<Artwork[]> => {
  if (isConfigured) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        where('featured', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Artwork));
      }
    } catch (e) {
      console.warn('Firestore getFeaturedArtworks failed, using local:', e);
    }
  }
  return getLocalArtworks()
    .filter((a) => a.published && a.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getArtworkBySlug = async (slug: string): Promise<Artwork | null> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as Artwork;
      }
    } catch (e) {
      console.warn('Firestore getArtworkBySlug failed, using local:', e);
    }
  }
  const found = getLocalArtworks().find((a) => a.slug === slug);
  return found || null;
};

export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Artwork;
      }
    } catch (e) {
      console.warn('Firestore getArtworkById failed, using local:', e);
    }
  }
  const found = getLocalArtworks().find((a) => a.id === id);
  return found || null;
};

export const createArtwork = async (data: ArtworkFormData): Promise<string> => {
  const newId = 'art-' + Date.now();
  const newArtwork: Artwork = {
    ...data,
    id: newId,
    coverImage: data.coverImage || (data.images && data.images[0]) || '',
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
  };

  const list = getLocalArtworks();
  list.unshift(newArtwork);
  saveLocalArtworks(list);

  if (isConfigured) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (e) {
      console.warn('Firestore createArtwork failed, saved locally:', e);
    }
  }

  return newId;
};

export const updateArtwork = async (id: string, data: Partial<ArtworkFormData>): Promise<void> => {
  const list = getLocalArtworks();
  const idx = list.findIndex((a) => a.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      ...data,
      coverImage: data.coverImage || (data.images && data.images[0]) || list[idx].coverImage,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    };
    saveLocalArtworks(list);
  }

  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore updateArtwork failed, saved locally:', e);
    }
  }
};

export const deleteArtwork = async (id: string): Promise<void> => {
  const list = getLocalArtworks().filter((a) => a.id !== id);
  saveLocalArtworks(list);

  if (isConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (e) {
      console.warn('Firestore deleteArtwork failed, removed locally:', e);
    }
  }
};

export const getAdjacentArtworks = async (
  currentSortOrder: number
): Promise<{ prev: Artwork | null; next: Artwork | null }> => {
  const published = (await getPublishedArtworks()).sort((a, b) => a.sortOrder - b.sortOrder);
  const curIdx = published.findIndex((a) => a.sortOrder === currentSortOrder);

  if (curIdx === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: curIdx > 0 ? published[curIdx - 1] : null,
    next: curIdx < published.length - 1 ? published[curIdx + 1] : null,
  };
};
