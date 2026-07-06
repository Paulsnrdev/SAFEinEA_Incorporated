import { useEffect, useState } from 'react';
import { getAllUsers, getAllEnrollments } from '../../firebase/adminService';
import { getCourses } from '../../firebase/courseService';
import { Users, BookOpen, TrendingUp, Award, CheckCircle, Clock, BookMarked, BarChart2 } from 'lucide-react';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [], courses: [], enrollments: [],
  });

  useEffect(() => {
    (async () => {
      const [users, courses, enrollments] = await Promise.all([
        getAllUsers(),
        getCourses(),
        getAllEnrollments(),
      ]);
      setData({ users, courses, enrollments });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">Platform performance overview.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="card h-24 animate-pulse bg-gray-100" />)}
        </div>
      </div>
    );
  }

  const { users, courses, enrollments } = data;

  const published    = courses.filter((c) => c.published).length;
  const completed    = enrollments.filter((e) => e.status === 'Completed').length;
  const inProgress   = enrollments.filter((e) => e.status === 'InProgress').length;
  const notStarted   = enrollments.filter((e) => e.status === 'NotStarted').length;
  const completionPct = enrollments.length > 0
    ? Math.round((completed / enrollments.length) * 100) : 0;

  // Top courses by enrollment count
  const enrollCountByCourse = enrollments.reduce((acc, e) => {
    acc[e.courseId] = (acc[e.courseId] ?? 0) + 1;
    return acc;
  }, {});
  const topCourses = courses
    .map((c) => ({ ...c, enrollCount: enrollCountByCourse[c.id] ?? 0 }))
    .filter((c) => c.enrollCount > 0)
    .sort((a, b) => b.enrollCount - a.enrollCount)
    .slice(0, 8);

  // Most active learners (most enrollments)
  const enrollCountByUser = enrollments.reduce((acc, e) => {
    acc[e.userId] = (acc[e.userId] ?? 0) + 1;
    return acc;
  }, {});
  const topLearners = users
    .map((u) => ({ ...u, enrollCount: enrollCountByUser[u.uid] ?? 0 }))
    .filter((u) => u.enrollCount > 0)
    .sort((a, b) => b.enrollCount - a.enrollCount)
    .slice(0, 5);

  const overviewStats = [
    { label: 'Total Users',      value: users.length,       icon: Users,      color: 'bg-purple-50 text-purple-600' },
    { label: 'Published Courses', value: published,          icon: BookOpen,   color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Enrollments', value: enrollments.length, icon: BookMarked, color: 'bg-orange-50 text-orange-600' },
    { label: 'Completion Rate',   value: `${completionPct}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  ];

  const statusStats = [
    { label: 'Not Started', value: notStarted, color: 'bg-gray-400', pct: enrollments.length ? Math.round((notStarted / enrollments.length) * 100) : 0 },
    { label: 'In Progress', value: inProgress, color: 'bg-orange-400', pct: enrollments.length ? Math.round((inProgress / enrollments.length) * 100) : 0 },
    { label: 'Completed',   value: completed,  color: 'bg-green-500', pct: completionPct },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm">Platform performance overview.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Enrollment Status Breakdown */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">Enrollment Status</h2>
            <span className="ml-auto text-xs text-gray-400">{enrollments.length} total</span>
          </div>
          {enrollments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No enrollments yet.</p>
          ) : (
            <div className="space-y-4">
              {statusStats.map(({ label, value, color, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="text-gray-500">{value} <span className="text-gray-300">({pct}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Active Learners */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">Most Active Learners</h2>
          </div>
          {topLearners.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No enrollment data yet.</p>
          ) : (
            <div className="space-y-3">
              {topLearners.map((u, i) => {
                const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email;
                const initial = name[0]?.toUpperCase() ?? '?';
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 shrink-0">
                      {u.enrollCount} course{u.enrollCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Courses by Enrollment */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-orange-500" />
          <h2 className="font-bold text-gray-900">Top Courses by Enrollment</h2>
        </div>
        {topCourses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No enrollment data yet.</p>
        ) : (
          <div className="space-y-3">
            {topCourses.map((c, i) => {
              const maxCount = topCourses[0]?.enrollCount ?? 1;
              const pct = Math.round((c.enrollCount / maxCount) * 100);
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate pr-4">{c.title}</p>
                      <span className="text-xs font-bold text-blue-600 shrink-0">
                        {c.enrollCount} enrolled
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MiniStat label="Draft Courses"  value={courses.length - published} color="text-yellow-600" />
        <MiniStat label="Total Courses"  value={courses.length}             color="text-blue-600" />
        <MiniStat label="Total Learners" value={users.filter(u => u.role !== 'admin').length} color="text-purple-600" />
        <MiniStat label="Admins"         value={users.filter(u => u.role === 'admin').length} color="text-orange-600" />
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="card text-center">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
