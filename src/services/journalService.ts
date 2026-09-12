import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase/config';
import type { JournalPost, JournalPostFormData } from '../types';
import { initialJournalPosts } from '../lib/mockData';

const COLLECTION = 'journal';
const LOCAL_STORAGE_KEY = 'studio_journal_data';

const getLocalPosts = (): JournalPost[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialJournalPosts));
    return initialJournalPosts;
  } catch {
    return initialJournalPosts;
  }
};

const saveLocalPosts = (posts: JournalPost[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new CustomEvent('studio_journal_updated'));
  } catch (e) {
    console.warn('Failed to save journal to localStorage:', e);
  }
};

export const getPublishedPosts = async (): Promise<JournalPost[]> => {
  if (isConfigured) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as JournalPost));
      }
    } catch (e) {
      console.warn('Firestore getPublishedPosts failed, using local:', e);
    }
  }
  return getLocalPosts().filter((p) => p.published);
};

export const getAllPosts = async (): Promise<JournalPost[]> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as JournalPost));
      if (items.length > 0) {
        saveLocalPosts(items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getAllPosts failed, using local:', e);
    }
  }
  return getLocalPosts();
};

export const getPostBySlug = async (slug: string): Promise<JournalPost | null> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { ...d.data(), id: d.id } as JournalPost;
      }
    } catch (e) {
      console.warn('Firestore getPostBySlug failed, using local:', e);
    }
  }
  const found = getLocalPosts().find((p) => p.slug === slug);
  return found || null;
};

export const getPostById = async (id: string): Promise<JournalPost | null> => {
  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { ...snapshot.data(), id: snapshot.id } as JournalPost;
      }
    } catch (e) {
      console.warn('Firestore getPostById failed, using local:', e);
    }
  }
  const found = getLocalPosts().find((p) => p.id === id);
  return found || null;
};

export const getRecentPosts = async (count: number = 3): Promise<JournalPost[]> => {
  const published = await getPublishedPosts();
  return published.slice(0, count);
};

export const createPost = async (data: JournalPostFormData): Promise<string> => {
  const docRef = isConfigured ? doc(collection(db, COLLECTION)) : null;
  const newId = docRef ? docRef.id : ('post-' + Date.now());

  const newPost: JournalPost = {
    ...data,
    id: newId,
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
  };

  const list = getLocalPosts();
  list.unshift(newPost);
  saveLocalPosts(list);

  if (isConfigured && docRef) {
    try {
      await setDoc(docRef, {
        ...data,
        id: newId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newId;
    } catch (e) {
      console.error('Firestore createPost failed, saved locally:', e);
    }
  }

  return newId;
};

export const updatePost = async (id: string, data: Partial<JournalPostFormData>): Promise<void> => {
  const list = getLocalPosts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      ...data,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    };
    saveLocalPosts(list);
  }

  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Firestore updatePost failed, saved locally:', e);
    }
  }
};

export const deletePost = async (id: string): Promise<void> => {
  const list = getLocalPosts().filter((p) => p.id !== id);
  saveLocalPosts(list);

  if (isConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (e) {
      console.error('Firestore deletePost failed, removed locally:', e);
      throw e;
    }
  }
};
