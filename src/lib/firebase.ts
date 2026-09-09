/**
 * Firebase (Firestore) initialization.
 * The SDK is initialized lazily so the app still renders when the config
 * has not been provided yet (a friendly warning is shown instead).
 */
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firestoreDb: Firestore | null = null;

export function getFirebaseDb(): Firestore {
  if (!firestoreDb) {
    const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(app);

    // Development only (optional): point Firestore at a local emulator.
    // Set VITE_FIREBASE_EMULATOR_HOST=127.0.0.1:8080 in .env.local to enable.
    const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST;
    if (emulatorHost) {
      const [host, port] = emulatorHost.split(':');
      connectFirestoreEmulator(firestoreDb, host || '127.0.0.1', Number(port) || 8080);
    }
  }
  return firestoreDb;
}
