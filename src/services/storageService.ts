import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage, isConfigured } from '../lib/firebase/config';

export type UploadProgressCallback = (progress: number) => void;

/**
 * Compresses an image file and converts to a base64 Data URL.
 * Keeps file size small for fast browser performance and local persistence.
 */
export const compressImageToDataUrl = (
  file: File,
  maxWidth = 1600,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If not an image, read directly as data URL
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Upload a file to Firebase Storage if configured, or gracefully fallback
 * to local optimized Data URL for preview / development mode.
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  // If Firebase is configured with real credentials, attempt cloud upload
  if (isConfigured) {
    try {
      return await new Promise<string>((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(Math.round(progress));
          },
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
    } catch (err) {
      console.warn('Firebase Storage upload failed, falling back to local image data URL:', err);
    }
  }

  // Graceful fallback for local development / unconfigured Firebase
  onProgress?.(30);
  const dataUrl = await compressImageToDataUrl(file);
  onProgress?.(100);
  return dataUrl;
};

/**
 * Upload multiple files with progress tracking.
 */
export const uploadFiles = async (
  files: File[],
  basePath: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> => {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const timestamp = Date.now();
    const safeName = files[i].name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${basePath}/${timestamp}_${safeName}`;
    const url = await uploadFile(files[i], path, (p) => onProgress?.(i, p));
    urls.push(url);
  }
  return urls;
};
