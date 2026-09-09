/**
 * Central place for environment-based configuration.
 * This module intentionally has no heavy SDK imports so that public pages
 * can check configuration status without pulling the Firebase bundle.
 */

const isPlaceholder = (value: string | undefined): boolean =>
  !value || value.trim() === '' || value.includes('YOUR_');

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every((value) => !isPlaceholder(value));
}

export function isCloudinaryConfigured(): boolean {
  return !isPlaceholder(cloudinaryCloudName) && !isPlaceholder(cloudinaryUploadPreset);
}
