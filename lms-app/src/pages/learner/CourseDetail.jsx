import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse } from '../../store/coursesSlice';
import { useAuth } from '../../context/AuthContext';
import { enrollUser, isEnrolled, getLessons } from '../../firebase/courseService';
import { Clock, BarChart2, BookOpen, CheckCircle, PlayCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { id }              = useParams();
  const dispatch            = useDispatch();
  const navigate            = useNavigate();
  const { user }            = useAuth();
  const { current: course, loading } = useSelector((s) => s.courses);

  const [enrollment, setEnrollment] = useState(null);
  const [lessons,    setLessons]    = useState([]);
  const [enrolling,  setEnrolling]  = useState(false);

  useEffect(() => {
    dispatch(fetchCourse(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    getLessons(id).then(setLessons);
    if (user) isEnrolled(user.uid, id).then(setEnrollment);
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login', { state: { from: { pathname: `/courses/${id}` } } }); return; }
    setEnrolling(true);
    try {
      await enrollUser(user.uid, id);
      const e = await isEnrolled(user.uid, id);
      setEnrollment(e);
      toast.success('Enrolled successfully!');
    } catch {
      toast.error('Could not enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 h-48 rounded-xl" />
        <div className="bg-gray-200 h-6 rounded w-1/2" />
        <div className="bg-gray-200 h-4 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-8 text-white mb-8">
        {course.category && (
          <span className="text-xs uppercase tracking-widest text-primary-200 font-semibold mb-3 block">
            {course.category}
          </span>
        )}
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-primary-100 text-sm leading-relaxed mb-6 max-w-2xl">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-primary-200">
          {course.duration && (
            <span className="flex items-center gap-1.5"><Clock size={14} /> {course.duration} min</span>
          )}
          {course.level && (
            <span className="flex items-center gap-1.5"><BarChart2 size={14} /> {course.level}</span>
          )}
          <span className="flex items-center gap-1.5"><BookOpen size={14} /> {lessons.length} lessons</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Lessons list */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>
          {lessons.length === 0 ? (
            <p className="text-gray-400 text-sm">No lessons added yet.</p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, i) => {
                const accessible = enrollment || i === 0;
                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors
                      ${accessible ? 'border-gray-100 hover:border-primary-200 bg-white cursor-pointer' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                    onClick={() => accessible && enrollment && navigate(`/learn/${id}/lesson/${lesson.id}`)}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${accessible ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                      {accessible ? <PlayCircle size={16} /> : <Lock size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                      {lesson.duration && (
                        <p className="text-xs text-gray-400">{lesson.duration} min</p>
                      )}
                    </div>
                    {lesson.completed && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar card */}
        <div>
          <div className="card sticky top-24">
            {enrollment ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-primary-700">{enrollment.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 transition-all"
                      style={{ width: `${enrollment.progress ?? 0}%` }}
                    />
                  </div>
                </div>
                <Link
                  to={`/learn/${id}/lesson/${lessons[0]?.id}`}
                  className="btn-primary w-full text-center block"
                >
                  {enrollment.progress > 0 ? 'Continue Course' : 'Start Course'}
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">Enroll to access all lessons and earn a certificate.</p>
                <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full">
                  {enrolling ? 'Enrolling…' : 'Enroll Now — Free'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
