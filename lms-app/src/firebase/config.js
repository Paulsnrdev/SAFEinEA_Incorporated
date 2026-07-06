import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace these values with your Firebase project config from
// Firebase Console > Project Settings > Your Apps > SDK setup and configuration
const firebaseConfig = {
  apiKey:            'AIzaSyBPwZ3o-2JeoorsICX4KFqLemRI-U62zVs',
  authDomain:        'safeinea-academy.firebaseapp.com',
  projectId:         'safeinea-academy',
  storageBucket:     'safeinea-academy.firebasestorage.app',
  messagingSenderId: '585591508556',
  appId:             '1:585591508556:web:c009ead0791ca814d22ee9',
  measurementId:     'G-P1831NMEYH',
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
