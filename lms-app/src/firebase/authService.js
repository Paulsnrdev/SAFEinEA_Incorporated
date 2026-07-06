import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export const registerUser = async ({ email, password, firstName, lastName }) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: `${firstName} ${lastName}` });
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid:       credential.user.uid,
    email,
    firstName,
    lastName,
    role:      'learner',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return credential.user;
};

export const loginUser = async ({ email, password }) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback);

export const updateUserProfile = async (uid, { firstName, lastName }) => {
  await updateDoc(doc(db, 'users', uid), {
    firstName,
    lastName,
    updatedAt: serverTimestamp(),
  });
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
  }
};
