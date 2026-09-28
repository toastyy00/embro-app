import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref as dbRef, onValue, off, set, get } from 'firebase/database';

export const DEFAULT_FIREBASE_URL = 'https://embro-1e285-default-rtdb.asia-southeast1.firebasedatabase.app/';

let app = null;
let db = null;

export function getFirebaseDb(customUrl = DEFAULT_FIREBASE_URL) {
  const url = (customUrl || DEFAULT_FIREBASE_URL).trim();
  if (!app) {
    const existing = getApps();
    if (existing.length > 0) {
      app = existing[0];
    } else {
      app = initializeApp({ databaseURL: url });
    }
  }
  if (!db) {
    db = getDatabase(app, url);
  }
  return db;
}

export { dbRef, onValue, off, set, get };
