import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export const uploadLessonVideo = (courseId, lessonId, file, onProgress) =>
  new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop();
    const storageRef = ref(storage, `lessons/${courseId}/${lessonId}/video.${ext}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });

export const deleteLessonVideo = async (courseId, lessonId, ext = 'mp4') => {
  try {
    await deleteObject(ref(storage, `lessons/${courseId}/${lessonId}/video.${ext}`));
  } catch {
    // File may not exist — ignore
  }
};
