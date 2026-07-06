import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { SEED_COURSES } from '../data/seedCourses';

const makeLessons = (course) => [
  {
    title: `Introduction to ${course.title}`,
    order: 1,
    duration: 10,
    type: 'text',
    content: `<h2>Welcome to ${course.title}</h2>
<p>This course covers the essential concepts and practices related to <strong>${course.category}</strong>. By the end, you will have a solid understanding of the key principles and how to apply them in your workplace.</p>
<h3>What You Will Learn</h3>
<ul>
<li>Core principles and applicable regulations</li>
<li>Practical application and best practices</li>
<li>Your legal rights and responsibilities</li>
<li>Emergency procedures and reporting requirements</li>
</ul>
<p><strong>Estimated time:</strong> ${course.duration} minutes total across all lessons.</p>`,
  },
  {
    title: 'Key Concepts & Regulations',
    order: 2,
    duration: Math.round(course.duration * 0.5),
    type: 'text',
    content: `<h2>Key Concepts &amp; Regulations</h2>
<p>In this lesson, we explore the fundamental concepts and regulatory requirements that govern <strong>${course.title}</strong> in Canadian workplaces.</p>
<h3>Regulatory Framework</h3>
<p>Canadian workplace safety is governed by both federal and provincial/territorial legislation. Employers have a legal duty to provide a safe work environment, and workers have the right to refuse unsafe work.</p>
<h3>Hierarchy of Controls</h3>
<p>A systematic approach to managing workplace hazards:</p>
<ol>
<li><strong>Elimination</strong> — Remove the hazard entirely</li>
<li><strong>Substitution</strong> — Replace with a less hazardous option</li>
<li><strong>Engineering Controls</strong> — Isolate people from the hazard</li>
<li><strong>Administrative Controls</strong> — Change the way people work</li>
<li><strong>PPE</strong> — Protect the worker with personal protective equipment</li>
</ol>`,
  },
  {
    title: 'Summary & Key Takeaways',
    order: 3,
    duration: 10,
    type: 'text',
    content: `<h2>Summary &amp; Key Takeaways</h2>
<p>Congratulations on completing the core material in <strong>${course.title}</strong>. Let's review what you've covered.</p>
<h3>What You've Learned</h3>
<ul>
<li>The fundamental principles and regulations in <strong>${course.category}</strong></li>
<li>Your rights and responsibilities as a worker or supervisor</li>
<li>How to identify hazards and apply appropriate controls</li>
<li>Incident reporting and emergency response procedures</li>
</ul>
<h3>Next Steps</h3>
<p>Apply what you've learned by following the safety procedures in your workplace. If you have questions, speak with your supervisor or health and safety representative.</p>
<p>Keep your training current — workplace safety requirements can change, and regular refreshers help maintain awareness.</p>`,
  },
];

const seedLessonsForCourse = async (courseId, course) => {
  const lessons = makeLessons(course);
  for (const lesson of lessons) {
    await addDoc(collection(db, 'courses', courseId, 'lessons'), {
      ...lesson,
      createdAt: serverTimestamp(),
    });
  }
};

export const seedDatabase = async (onProgress) => {
  const existing = await getDocs(collection(db, 'courses'));
  if (!existing.empty) {
    throw new Error(`Database already has ${existing.size} courses. Clear them first or use "Add Missing Only".`);
  }

  const results = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < SEED_COURSES.length; i++) {
    try {
      const courseRef = await addDoc(collection(db, 'courses'), {
        ...SEED_COURSES[i],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await seedLessonsForCourse(courseRef.id, SEED_COURSES[i]);
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push(`${SEED_COURSES[i].title}: ${err.message}`);
    }
    if (onProgress) onProgress(i + 1, SEED_COURSES.length);
  }

  return results;
};

export const seedMissingCourses = async (onProgress) => {
  const existing      = await getDocs(collection(db, 'courses'));
  const existingTitles = new Set(existing.docs.map((d) => d.data().title));
  const missing        = SEED_COURSES.filter((c) => !existingTitles.has(c.title));

  const results = { success: 0, failed: 0, skipped: existing.size, errors: [] };

  for (let i = 0; i < missing.length; i++) {
    try {
      const courseRef = await addDoc(collection(db, 'courses'), {
        ...missing[i],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await seedLessonsForCourse(courseRef.id, missing[i]);
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push(`${missing[i].title}: ${err.message}`);
    }
    if (onProgress) onProgress(i + 1, missing.length);
  }

  return results;
};
