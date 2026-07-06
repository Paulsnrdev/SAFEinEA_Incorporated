import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../firebase/courseService';
import { getAllUsers } from '../../firebase/adminService';
import { seedDatabase, seedMissingCourses } from '../../firebase/seedService';
import { SEED_COURSES } from '../../data/seedCourses';
import { BookOpen, Users, TrendingUp, Award, Plus, ArrowRight, Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [courses,    setCourses]    = useState([]);
  const [userCount,  setUserCount]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [seeding,  setSeeding]  = useState(false);
  const [seedProgress, setSeedProgress] = useState({ current: 0, total: 0 });
  const [seedResult,   setSeedResult]   = useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    const [c, users] = await Promise.all([getCourses(), getAllUsers()]);
    setCourses(c);
    setUserCount(users.length);
    setLoading(false);
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const published = courses.filter((c) => c.published).length;
  const drafts    = courses.filter((c) => !c.published).length;

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen,   color: 'text-primary-600 bg-primary-50', to: '/admin/courses' },
    { label: 'Published',     value: published,       icon: TrendingUp, color: 'text-green-600 bg-green-50',    to: '/admin/courses' },
    { label: 'Drafts',        value: drafts,          icon: Award,      color: 'text-yellow-600 bg-yellow-50',  to: '/admin/courses' },
    { label: 'Users',         value: userCount ?? '—', icon: Users,      color: 'text-purple-600 bg-purple-50',  to: '/admin/users'   },
  ];

  const handleSeedAll = async () => {
    if (!confirm(`This will load ${SEED_COURSES.length} sample safety courses into your database. Continue?`)) return;
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedDatabase((current, total) => setSeedProgress({ current, total }));
      setSeedResult(result);
      toast.success(`${result.success} courses added successfully!`);
      loadCourses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
      setSeedProgress({ current: 0, total: 0 });
    }
  };

  const handleSeedMissing = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedMissingCourses((current, total) => setSeedProgress({ current, total }));
      setSeedResult(result);
      if (result.success > 0) {
        toast.success(`${result.success} missing courses added!`);
        loadCourses();
      } else {
        toast('All courses already exist — nothing to add.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
      setSeedProgress({ current: 0, total: 0 });
    }
  };

  const pct = seedProgress.total > 0
    ? Math.round((seedProgress.current / seedProgress.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage courses, users, and platform settings.</p>
        </div>
        <Link to="/admin/courses/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '…' : value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Seed Panel */}
      <div className="card border-2 border-dashed border-primary-200 bg-primary-50/40">
        <div className="flex items-start gap-3 mb-4">
          <Database size={22} className="text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="font-bold text-gray-900">Preload Sample Courses</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Load <strong>{SEED_COURSES.length} ready-made safety courses</strong> into your catalog — WHMIS, Fire Safety, First Aid, Environmental, Food Safety, and more.
              You can edit any course after loading.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {seeding && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1.5"><Loader size={12} className="animate-spin" /> Loading courses…</span>
              <span>{seedProgress.current} / {seedProgress.total}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Result */}
        {seedResult && !seeding && (
          <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm
            ${seedResult.failed === 0 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {seedResult.failed === 0
              ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
            <span>
              {seedResult.success} courses added
              {seedResult.skipped > 0 && `, ${seedResult.skipped} already existed`}
              {seedResult.failed > 0  && `, ${seedResult.failed} failed`}.
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeedAll}
            disabled={seeding || courses.length > 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
            title={courses.length > 0 ? 'Database already has courses. Use "Add Missing" instead.' : ''}
          >
            <Database size={15} />
            {seeding ? 'Loading…' : `Load All ${SEED_COURSES.length} Courses`}
          </button>
          <button
            onClick={handleSeedMissing}
            disabled={seeding}
            className="btn-secondary flex items-center gap-2"
          >
            Add Missing Only
          </button>
          {courses.length > 0 && (
            <span className="text-xs text-gray-400 self-center">
              {courses.length} course{courses.length !== 1 ? 's' : ''} already in database
            </span>
          )}
        </div>
      </div>

      {/* Recent Courses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Courses</h2>
          <Link to="/admin/courses" className="text-sm text-primary-600 flex items-center gap-1 hover:underline">
            Manage all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No courses yet. Use the panel above or{' '}
            <Link to="/admin/courses/new" className="text-primary-600 underline">create one manually</Link>.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-2">Title</th>
                  <th className="pb-2 hidden md:table-cell">Category</th>
                  <th className="pb-2 hidden md:table-cell">Level</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.slice(0, 10).map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 font-medium text-gray-800 max-w-xs truncate">{c.title}</td>
                    <td className="py-3 text-gray-500 hidden md:table-cell">{c.category ?? '—'}</td>
                    <td className="py-3 text-gray-500 hidden md:table-cell">{c.level ?? '—'}</td>
                    <td className="py-3">
                      <span className={`badge ${c.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {c.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/admin/courses/${c.id}/edit`} className="text-primary-600 hover:underline text-xs">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
