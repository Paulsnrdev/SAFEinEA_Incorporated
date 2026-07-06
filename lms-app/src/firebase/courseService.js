import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const COURSES     = 'courses';
const ENROLLMENTS = 'enrollments';
const LESSONS     = 'lessons';

// ─── Courses ────────────────────────────────────────────────────────────────

export const getCourses = async (filters = {}) => {
  const constraints = [];
  if (filters.category)                constraints.push(where('category',  '==', filters.category));
  if (filters.published !== undefined) constraints.push(where('published', '==', filters.published));
  const q = constraints.length
    ? query(collection(db, COURSES), ...constraints)
    : collection(db, COURSES);
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return results.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
};

export const getCourseById = async (id) => {
  const snap = await getDoc(doc(db, COURSES, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createCourse = async (data) => {
  const ref = await addDoc(collection(db, COURSES), {
    ...data,
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateCourse = async (id, data) => {
  await updateDoc(doc(db, COURSES, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteCourse = async (id) => {
  await deleteDoc(doc(db, COURSES, id));
};

// ─── Lessons ────────────────────────────────────────────────────────────────

export const getLessons = async (courseId) => {
  const snap = await getDocs(collection(db, COURSES, courseId, LESSONS));
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return results.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getLessonById = async (courseId, lessonId) => {
  const snap = await getDoc(doc(db, COURSES, courseId, LESSONS, lessonId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createLesson = async (courseId, data) => {
  const ref = await addDoc(collection(db, COURSES, courseId, LESSONS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateLesson = async (courseId, lessonId, data) => {
  await updateDoc(doc(db, COURSES, courseId, LESSONS, lessonId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteLesson = async (courseId, lessonId) => {
  await deleteDoc(doc(db, COURSES, courseId, LESSONS, lessonId));
};

// ─── Enrollments ─────────────────────────────────────────────────────────────

export const enrollUser = async (userId, courseId) => {
  const ref = await addDoc(collection(db, ENROLLMENTS), {
    userId,
    courseId,
    status:           'NotStarted',
    progress:         0,
    completedLessons: [],
    enrolledAt:       serverTimestamp(),
    updatedAt:        serverTimestamp(),
  });
  return ref.id;
};

export const getUserEnrollments = async (userId) => {
  const q = query(collection(db, ENROLLMENTS), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateEnrollmentProgress = async (enrollmentId, progress, status) => {
  await updateDoc(doc(db, ENROLLMENTS, enrollmentId), {
    progress,
    status,
    updatedAt: serverTimestamp(),
    ...(status === 'Completed' ? { completedAt: serverTimestamp() } : {}),
  });
};

export const markLessonComplete = async (enrollmentId, lessonId, allLessonIds) => {
  const snap = await getDoc(doc(db, ENROLLMENTS, enrollmentId));
  if (!snap.exists()) return null;

  const data = snap.data();
  const completed = new Set(data.completedLessons ?? []);
  completed.add(lessonId);

  const progress = allLessonIds.length > 0
    ? Math.round((completed.size / allLessonIds.length) * 100)
    : 0;
  const status = progress >= 100 ? 'Completed' : 'InProgress';

  await updateDoc(doc(db, ENROLLMENTS, enrollmentId), {
    completedLessons: Array.from(completed),
    progress,
    status,
    updatedAt: serverTimestamp(),
    ...(status === 'Completed' ? { completedAt: serverTimestamp() } : {}),
  });

  return { completedLessons: Array.from(completed), progress, status };
};

export const isEnrolled = async (userId, courseId) => {
  const q = query(
    collection(db, ENROLLMENTS),
    where('userId',   '==', userId),
    where('courseId', '==', courseId),
    limit(1),
  );
  const snap = await getDocs(q);
  return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
};
