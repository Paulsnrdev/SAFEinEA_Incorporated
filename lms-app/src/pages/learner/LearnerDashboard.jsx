import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { getUserEnrollments, getCourseById } from '../../firebase/courseService';
import { fetchCourses } from '../../store/coursesSlice';
import {
  BookOpen, ChevronRight, ChevronLeft, FileText,
  Play, MoreHorizontal, Plus, FolderOpen, BookMarked,
} from 'lucide-react';

export default function LearnerDashboard() {
  const { user, profile } = useAuth();
  const dispatch = useDispatch();
  const { list: courses, loading: coursesLoading } = useSelector((s) => s.courses);
  const [enrolledData, setEnrolledData]   = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(true);
  const carouselRef = useRef(null);
  const [scrollState, setScrollState] = useState({ left: false, right: false });

  useEffect(() => { dispatch(fetchCourses({ published: true })); }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const enrollments = await getUserEnrollments(user.uid);
      const pairs = await Promise.all(
        enrollments.map(async (e) => {
          const c = await getCourseById(e.courseId);
          return c ? { course: c, enrollment: e } : null;
        })
      );
      setEnrolledData(pairs.filter(Boolean));
      setEnrollLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    if (courses.length > 0) setTimeout(updateScroll, 120);
  }, [courses]);

  const inProgress = enrolledData.filter((d) => d.enrollment.status === 'InProgress');
  const firstName  = profile?.firstName ?? (user?.displayName?.split(' ')[0] ?? 'Learner');
  const lastName   = profile?.lastName  ?? (user?.displayName?.split(' ').slice(1).join(' ') ?? '');

  const updateScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setScrollState({
      left:  el.scrollLeft > 4,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  };

  const scrollBy = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 210, behavior: 'smooth' });
    setTimeout(updateScroll, 320);
  };

  return (
    <div className="-mx-6 -mt-6">

      {/* ── Welcome Banner ── */}
      <div className="bg-[#0d1d40] py-10 text-center text-white px-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome {firstName}{lastName ? ` ${lastName}` : ''}!
        </h1>
        <p className="text-gray-300 mt-2 text-sm">We're glad to have you!</p>
      </div>

      {/* ── Gold Main Area ── */}
      <div className="min-h-[calc(100vh-64px)] pb-12" style={{ background: '#d4a017' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

          {/* ── Feature Cards (4-col) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Resume / Nothing to resume */}
            <Link
              to={inProgress.length > 0 ? `/courses/${inProgress[0].course.id}` : '/catalog'}
              className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
              style={{ minHeight: 96 }}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <BookOpen size={24} className="text-blue-400" />
              </div>
              <div className="min-w-0">
                {inProgress.length > 0 ? (
                  <>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">{inProgress[0].course.title}</p>
                    <span className="text-blue-500 text-sm font-semibold flex items-center gap-0.5">
                      Resume <ChevronRight size={14} />
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-1 leading-tight">Nothing to resume yet</p>
                    <span className="text-blue-500 text-sm font-semibold flex items-center gap-0.5">
                      View Catalog <ChevronRight size={14} />
                    </span>
                  </>
                )}
              </div>
            </Link>

            {/* My Courses */}
            <Link
              to="/my-courses"
              className="rounded-xl overflow-hidden flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow relative"
              style={{ minHeight: 96, background: '#2d3748' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 opacity-90" />
              <div className="relative z-10 px-3">
                <BookMarked size={28} className="text-blue-400 mx-auto mb-1" />
                <p className="font-bold text-white text-sm">My Courses</p>
                <p className="text-xs text-gray-300 mt-0.5 leading-tight">See courses you are enrolled in</p>
              </div>
            </Link>

            {/* Catalog */}
            <Link
              to="/catalog"
              className="rounded-xl overflow-hidden flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow relative"
              style={{ minHeight: 96, background: '#374151' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-800 opacity-80" />
              <div className="relative z-10 px-3">
                <BookOpen size={28} className="text-blue-400 mx-auto mb-1" />
                <p className="font-bold text-white text-sm">Catalog</p>
                <p className="text-xs text-gray-300 mt-0.5 leading-tight">See a complete list of available courses</p>
              </div>
            </Link>

            {/* Resources */}
            <div
              className="rounded-xl overflow-hidden flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow relative cursor-pointer"
              style={{ minHeight: 96, background: '#1f2937' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 opacity-85" />
              <div className="relative z-10 px-3">
                <FolderOpen size={28} className="text-blue-400 mx-auto mb-1" />
                <p className="font-bold text-white text-sm">Resources</p>
                <p className="text-xs text-gray-300 mt-0.5 leading-tight">Browse or download resources</p>
              </div>
            </div>
          </div>

          {/* ── Two Column Layout ── */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* What's Next */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-100">
                  <span className="font-bold text-[#b8960c]">What's Next</span>
                  <span className="text-xs text-gray-400 hidden sm:block flex-1 truncate">
                    Everything you need to accomplish, ordered by priority
                  </span>
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center shrink-0">
                    {inProgress.length}
                  </span>
                </div>

                {enrollLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2].map((i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
                  </div>
                ) : inProgress.length > 0 ? (
                  inProgress.slice(0, 3).map((d) => (
                    <div key={d.course.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <div className="w-10 h-10 rounded shrink-0 overflow-hidden">
                        {d.course.thumbnailUrl
                          ? <img src={d.course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center"><BookOpen size={14} className="text-white/60" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{d.course.title}</p>
                        <p className="text-xs text-gray-400">{d.course.type ?? 'Online course'}</p>
                        <div className="w-full h-0.5 bg-gray-100 rounded-full mt-1.5">
                          <div className="h-0.5 bg-yellow-400 rounded-full" style={{ width: `${d.enrollment.progress ?? 0}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          to={`/courses/${d.course.id}`}
                          className="flex items-center gap-0.5 text-xs font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap"
                        >
                          Start <Play size={10} fill="currentColor" />
                        </Link>
                        <button className="text-gray-300 hover:text-gray-500 p-0.5"><Plus size={14} /></button>
                        <button className="text-gray-300 hover:text-gray-500 p-0.5"><MoreHorizontal size={14} /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-6 text-center text-sm text-gray-400">
                    No courses in progress.{' '}
                    <Link to="/catalog" className="text-blue-500 hover:underline">Browse catalog</Link> to get started.
                  </div>
                )}
              </div>

              {/* Featured Courses Carousel */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-100">
                  <span className="font-bold text-[#b8960c]">Featured Courses</span>
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center ml-auto">
                    {courses.length}
                  </span>
                </div>

                {coursesLoading ? (
                  <div className="flex gap-3 p-4">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="w-44 shrink-0 h-44 bg-gray-100 rounded-lg animate-pulse" />)}
                  </div>
                ) : courses.length > 0 ? (
                  <div className="relative">
                    {scrollState.left && (
                      <button
                        onClick={() => scrollBy(-1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
                      >
                        <ChevronLeft size={15} className="text-gray-600" />
                      </button>
                    )}
                    <div
                      ref={carouselRef}
                      onScroll={updateScroll}
                      className="flex gap-3 p-4 overflow-x-auto"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {courses.map((course) => (
                        <Link
                          key={course.id}
                          to={`/courses/${course.id}`}
                          className="w-44 shrink-0 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-white"
                        >
                          <div className="h-28 relative bg-gradient-to-br from-blue-800 to-blue-950">
                            {course.thumbnailUrl && (
                              <img src={course.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="p-2.5 flex flex-col flex-1">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mb-0.5">{course.title}</p>
                            <p className="text-xs text-gray-400">{course.type ?? 'Online course'}</p>
                            <div className="mt-auto pt-2">
                              <div className="w-full bg-orange-500 text-white text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors">
                                {course.price ? `$${course.price}` : 'Enroll'} <Plus size={11} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {scrollState.right && (
                      <button
                        onClick={() => scrollBy(1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50"
                      >
                        <ChevronRight size={15} className="text-gray-600" />
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="px-5 py-6 text-center text-sm text-gray-400">No courses available yet.</p>
                )}
              </div>
            </div>

            {/* Right Column – Transcript */}
            <div className="w-full lg:w-64 shrink-0">
              <Link
                to="/certificates"
                className="flex flex-col items-center justify-center rounded-xl hover:shadow-md transition-shadow"
                style={{ height: 280, background: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)' }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-blue-300" />
                </div>
                <p className="font-bold text-white text-xl">Transcript</p>
                <p className="text-white/70 text-sm mt-1">View Transcript</p>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
