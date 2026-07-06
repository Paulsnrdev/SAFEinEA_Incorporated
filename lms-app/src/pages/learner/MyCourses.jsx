import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserEnrollments, getCourseById } from '../../firebase/courseService';
import CourseCard from '../../components/course/CourseCard';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = ['All', 'In Progress', 'Completed', 'Not Started'];

export default function MyCourses() {
  const { user }      = useAuth();
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState('All');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const enrollments = await getUserEnrollments(user.uid);
      const pairs = await Promise.all(
        enrollments.map(async (e) => {
          const course = await getCourseById(e.courseId);
          return course ? { course, enrollment: e } : null;
        })
      );
      setData(pairs.filter(Boolean));
      setLoading(false);
    };
    load();
  }, [user]);

  const filtered = data.filter(({ enrollment: e }) => {
    if (tab === 'All')         return true;
    if (tab === 'In Progress') return e.status === 'InProgress';
    if (tab === 'Completed')   return e.status === 'Completed';
    if (tab === 'Not Started') return e.status === 'NotStarted';
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors
              ${tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map((i) => <div key={i} className="card animate-pulse h-56" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ course, enrollment }) => (
            <CourseCard key={course.id} course={course} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 text-sm">No courses in this category.</p>
          {tab === 'All' && (
            <Link to="/catalog" className="btn-primary mt-4 inline-block">Browse Catalog</Link>
          )}
        </div>
      )}
    </div>
  );
}
