import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
};

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, 'users', uid), { role, updatedAt: serverTimestamp() });
};

export const getAllEnrollments = async () => {
  const snap = await getDocs(collection(db, 'enrollments'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
