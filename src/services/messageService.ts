import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase/config';
import type { ContactMessage, ContactMessageFormData, MessageStatus } from '../types';
import { initialMessages } from '../lib/mockData';

const COLLECTION = 'messages';
const LOCAL_STORAGE_KEY = 'studio_messages_data';

const getLocalMessages = (): ContactMessage[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMessages));
    return initialMessages;
  } catch {
    return initialMessages;
  }
};

const saveLocalMessages = (messages: ContactMessage[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn('Failed to save messages to localStorage:', e);
  }
};

export const getMessages = async (): Promise<ContactMessage[]> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as ContactMessage));
      if (items.length > 0) {
        saveLocalMessages(items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getMessages failed, using local:', e);
    }
  }
  return getLocalMessages();
};

export const getUnreadMessages = async (): Promise<ContactMessage[]> => {
  if (isConfigured) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('status', '==', 'unread'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as ContactMessage));
      }
    } catch (e) {
      console.warn('Firestore getUnreadMessages failed, using local:', e);
    }
  }
  return getLocalMessages().filter((m) => m.status === 'unread');
};

export const createMessage = async (data: ContactMessageFormData): Promise<string> => {
  const docRef = isConfigured ? doc(collection(db, COLLECTION)) : null;
  const newId = docRef ? docRef.id : ('msg-' + Date.now());

  const newMsg: ContactMessage = {
    ...data,
    id: newId,
    status: 'unread' as MessageStatus,
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
  };

  const list = getLocalMessages();
  list.unshift(newMsg);
  saveLocalMessages(list);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studio_messages_updated'));
  }

  if (isConfigured && docRef) {
    try {
      await setDoc(docRef, {
        ...data,
        id: newId,
        status: 'unread' as MessageStatus,
        createdAt: serverTimestamp(),
      });
      return newId;
    } catch (e) {
      console.error('Firestore createMessage failed, saved locally:', e);
    }
  }

  return newId;
};

export const updateMessageStatus = async (id: string, status: MessageStatus): Promise<void> => {
  const list = getLocalMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], status };
    saveLocalMessages(list);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('studio_messages_updated'));
    }
  }

  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, { status });
    } catch (e) {
      console.error('Firestore updateMessageStatus failed, saved locally:', e);
    }
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  const list = getLocalMessages().filter((m) => m.id !== id);
  saveLocalMessages(list);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studio_messages_updated'));
  }

  if (isConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (e) {
      console.error('Firestore deleteMessage failed, removed locally:', e);
      throw e;
    }
  }
};
