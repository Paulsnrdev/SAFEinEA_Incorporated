import { Link } from 'react-router-dom';
import { Clock, BarChart2, BookOpen } from 'lucide-react';

const LEVEL_COLORS = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced:     'bg-red-100 text-red-700',
};

export default function CourseCard({ course, enrollment }) {
  const progress = enrollment?.progress ?? null;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="card group hover:shadow-md transition-shadow p-0 overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 h-36 relative flex-shrink-0">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen size={40} className="text-white opacity-40" />
          </div>
        )}
        {course.level && (
          <span className={`absolute top-2 right-2 badge text-xs ${LEVEL_COLORS[course.level] ?? 'bg-gray-100 text-gray-600'}`}>
            {course.level}
          </span>
        )}
        {progress !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-brand-yellow" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {course.category && (
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
            {course.category}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{course.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {course.duration ?? '—'} min
          </span>
          {progress !== null ? (
            <span className="text-primary-600 font-medium">{progress}% complete</span>
          ) : (
            <span className="flex items-center gap-1">
              <BarChart2 size={12} />
              {course.lessonCount ?? 0} lessons
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
