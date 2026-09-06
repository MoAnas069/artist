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
import type { Product, ProductFormData } from '../types';
import { initialProducts } from '../lib/mockData';

const COLLECTION = 'products';
const LOCAL_STORAGE_KEY = 'studio_products_data';

const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  } catch {
    return initialProducts;
  }
};

const saveLocalProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('studio_products_updated'));
  } catch (e) {
    console.warn('Failed to save products to localStorage:', e);
  }
};

export const getAvailableProducts = async (): Promise<Product[]> => {
  if (isConfigured) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('available', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      }
    } catch (e) {
      console.warn('Firestore getAvailableProducts failed, using local:', e);
    }
  }
  return getLocalProducts().filter((p) => p.available);
};

export const getAllProducts = async (): Promise<Product[]> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      }
    } catch (e) {
      console.warn('Firestore getAllProducts failed, using local:', e);
    }
  }
  return getLocalProducts();
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  if (isConfigured) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('available', '==', true),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      }
    } catch (e) {
      console.warn('Firestore getFeaturedProducts failed, using local:', e);
    }
  }
  return getLocalProducts().filter((p) => p.available && p.featured);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  if (isConfigured) {
    try {
      const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as Product;
      }
    } catch (e) {
      console.warn('Firestore getProductBySlug failed, using local:', e);
    }
  }
  const found = getLocalProducts().find((p) => p.slug === slug);
  return found || null;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Product;
      }
    } catch (e) {
      console.warn('Firestore getProductById failed, using local:', e);
    }
  }
  const found = getLocalProducts().find((p) => p.id === id);
  return found || null;
};

export const createProduct = async (data: ProductFormData): Promise<string> => {
  const newId = 'prod-' + Date.now();
  const newProduct: Product = {
    ...data,
    id: newId,
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
  };

  const list = getLocalProducts();
  list.unshift(newProduct);
  saveLocalProducts(list);

  if (isConfigured) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (e) {
      console.warn('Firestore createProduct failed, saved locally:', e);
    }
  }

  return newId;
};

export const updateProduct = async (id: string, data: Partial<ProductFormData>): Promise<void> => {
  const list = getLocalProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      ...data,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    };
    saveLocalProducts(list);
  }

  if (isConfigured) {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore updateProduct failed, saved locally:', e);
    }
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const list = getLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(list);

  if (isConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (e) {
      console.warn('Firestore deleteProduct failed, removed locally:', e);
    }
  }
};
