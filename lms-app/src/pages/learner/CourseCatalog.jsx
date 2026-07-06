import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/coursesSlice';
import { BookOpen, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// ── Update this URL to wherever "View All" should take the learner ──
const VIEW_ALL_URL = '/catalog.html';

const ITEMS_PER_PAGE = 7;

export default function CourseCatalog() {
  const dispatch = useDispatch();
  const { list: courses, loading } = useSelector((s) => s.courses);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchCourses({ published: true }));
  }, [dispatch]);

  const totalItems  = courses.length + 1;                        // +1 for View All card
  const totalPages  = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pageStart   = page * ITEMS_PER_PAGE;
  const pageEnd     = pageStart + ITEMS_PER_PAGE;
  const pageCourses = courses.slice(pageStart, Math.min(pageEnd, courses.length));
  const showViewAll = pageEnd > courses.length;                   // View All on last page

  return (
    <div className="-mx-6 -mt-6 min-h-[calc(100vh-64px)] pb-12" style={{ background: '#d4a017' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        <h2 className="text-xl font-bold text-gray-900 mb-6">Catalog</h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="bg-white/50 rounded-xl h-60 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-white">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No courses available yet.</p>
          </div>
        ) : (
          <div className="relative px-6">

            {/* Left arrow */}
            {page > 0 && (
              <button
                onClick={() => setPage((p) => p - 1)}
                className="absolute left-0 top-1/2 -translate-y-12 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
            )}

            {/* Course cards grid for current page */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {pageCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-36 sm:h-44 bg-gradient-to-br from-blue-800 to-blue-950">
                    {course.thumbnailUrl && (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    {(course.lessonCount ?? 0) > 0 && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-orange-400 text-white text-xs font-bold flex items-center justify-center">
                        {course.lessonCount}
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{course.type ?? 'Online course'}</p>
                    <div className="mt-auto pt-2">
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors">
                        {course.price ? `$${course.price}` : 'Enroll'} <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}

              {/* View All card – shown only on the last page */}
              {showViewAll && (
                <a
                  href={VIEW_ALL_URL}
                  className="bg-white rounded-xl flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
                  style={{ minHeight: 180 }}
                >
                  <span className="text-orange-500 font-bold text-sm">View All</span>
                </a>
              )}
            </div>

            {/* Right arrow */}
            {page < totalPages - 1 && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="absolute right-0 top-1/2 -translate-y-12 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            )}

            {/* Pagination dots */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === page ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
