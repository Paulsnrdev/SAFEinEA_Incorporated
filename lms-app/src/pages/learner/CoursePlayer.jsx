import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getCourseById, getLessons, isEnrolled, markLessonComplete,
} from '../../firebase/courseService';
import {
  ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock, Menu, X, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course,     setCourse]     = useState(null);
  const [lessons,    setLessons]    = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [marking,    setMarking]    = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const load = async () => {
      setLoading(true);
      try {
        const [c, ls, enr] = await Promise.all([
          getCourseById(courseId),
          getLessons(courseId),
          isEnrolled(user.uid, courseId),
        ]);
        if (!c)  { navigate('/catalog'); return; }
        if (!enr){ navigate(`/courses/${courseId}`); return; }
        setCourse(c);
        setLessons(ls);
        setEnrollment(enr);
        // If lessonId is invalid, go to first lesson
        if (ls.length > 0 && !ls.find((l) => l.id === lessonId)) {
          navigate(`/learn/${courseId}/lesson/${ls[0].id}`, { replace: true });
        }
      } catch {
        toast.error('Failed to load course.');
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const lesson       = currentIndex >= 0 ? lessons[currentIndex] : null;
  const prevLesson   = currentIndex > 0              ? lessons[currentIndex - 1] : null;
  const nextLesson   = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const completedSet = new Set(enrollment?.completedLessons ?? []);
  const isCompleted  = completedSet.has(lessonId);

  const handleMarkComplete = async () => {
    if (!enrollment || !lesson) return;
    setMarking(true);
    try {
      const result = await markLessonComplete(
        enrollment.id,
        lessonId,
        lessons.map((l) => l.id),
      );
      if (!result) return;
      setEnrollment((prev) => ({ ...prev, ...result }));
      if (result.status === 'Completed') {
        toast.success('Course completed! Great work!');
        navigate(`/courses/${courseId}`);
      } else {
        toast.success('Lesson complete!');
        if (nextLesson) navigate(`/learn/${courseId}/lesson/${nextLesson.id}`);
      }
    } catch {
      toast.error('Could not save progress. Please try again.');
    } finally {
      setMarking(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-24 text-gray-400">
        <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">Lesson not found</p>
        <Link to={`/courses/${courseId}`} className="text-primary-600 underline text-sm mt-2 block">
          Back to course
        </Link>
      </div>
    );
  }

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-4rem)]">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:static top-16 bottom-0 left-0 z-30
        w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col
        transition-transform duration-300
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <Link
              to={`/courses/${courseId}`}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600"
            >
              <ArrowLeft size={13} /> Back to course
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <h2 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{course?.title}</h2>
          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{completedSet.size} / {lessons.length} done</span>
              <span>{enrollment?.progress ?? 0}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-500"
                style={{ width: `${enrollment?.progress ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto">
          {lessons.map((l, i) => {
            const done   = completedSet.has(l.id);
            const active = l.id === lessonId;
            return (
              <button
                key={l.id}
                onClick={() => { navigate(`/learn/${courseId}/lesson/${l.id}`); setDrawerOpen(false); }}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors
                  ${active
                    ? 'bg-primary-50 border-l-[3px] border-l-primary-600'
                    : 'hover:bg-gray-50 border-l-[3px] border-l-transparent'
                  }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold
                  ${done ? 'bg-green-100 text-green-600' : active ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <CheckCircle size={13} /> : i + 1}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium leading-snug truncate
                    ${active ? 'text-primary-700' : 'text-gray-700'}`}>
                    {l.title}
                  </p>
                  {l.duration && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {l.duration} min
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/40 z-20 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 flex-shrink-0"
          >
            <Menu size={14} /> Lessons
          </button>
          <span className="text-sm font-medium text-gray-800 truncate flex-1">{lesson.title}</span>
          <span className="text-xs text-gray-400 whitespace-nowrap">{currentIndex + 1}/{lessons.length}</span>
        </div>

        {/* Scrollable lesson content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">

            {/* Lesson header */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-2 flex-wrap">
                <span>Lesson {currentIndex + 1} of {lessons.length}</span>
                {lesson.duration && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {lesson.duration} min</span>
                  </>
                )}
                {isCompleted && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={11} /> Completed
                    </span>
                  </>
                )}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>

            {/* Video — YouTube embed or direct upload */}
            {lesson.videoUrl && lesson.type !== 'text' && (
              <div className="mb-6">
                {lesson.type === 'youtube' ? (
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={lesson.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                ) : (
                  <video
                    src={lesson.videoUrl}
                    controls
                    className="w-full rounded-xl bg-black"
                  />
                )}
              </div>
            )}

            {/* Text content */}
            {lesson.content ? (
              <div
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            ) : (
              <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-400 my-6">
                <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Content coming soon</p>
                <p className="text-sm mt-1">This lesson&apos;s content hasn&apos;t been added yet.</p>
              </div>
            )}

            {/* Navigation footer */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={() => prevLesson && navigate(`/learn/${courseId}/lesson/${prevLesson.id}`)}
                disabled={!prevLesson}
                className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={15} /> Previous
              </button>

              {isCompleted ? (
                nextLesson ? (
                  <button
                    onClick={() => navigate(`/learn/${courseId}/lesson/${nextLesson.id}`)}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next Lesson <ArrowRight size={15} />
                  </button>
                ) : (
                  <Link to={`/courses/${courseId}`} className="btn-primary flex items-center gap-2">
                    <CheckCircle size={15} /> Finish Course
                  </Link>
                )
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {marking ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle size={15} />
                      {nextLesson ? 'Mark Complete & Continue' : 'Mark Complete & Finish'}
                      <ChevronRight size={15} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
