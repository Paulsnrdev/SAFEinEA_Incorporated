import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, resetPassword } from '../../firebase/authService';
import { getUserEnrollments } from '../../firebase/courseService';
import {
  User, Mail, Shield, Calendar, BookOpen,
  CheckCircle, Clock, Edit2, Save, X, KeyRound,
  ChevronRight, Award,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();

  // Edit form state
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '' });

  // Stats
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, notStarted: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Password reset
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ firstName: profile.firstName ?? '', lastName: profile.lastName ?? '' });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const enrollments = await getUserEnrollments(user.uid);
      setStats({
        total:      enrollments.length,
        inProgress: enrollments.filter((e) => e.status === 'InProgress').length,
        completed:  enrollments.filter((e) => e.status === 'Completed').length,
        notStarted: enrollments.filter((e) => e.status === 'NotStarted').length,
      });
      setStatsLoading(false);
    })();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First and last name are required.');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
      });
      await refreshProfile();
      toast.success('Profile updated.');
      setEditing(false);
    } catch {
      toast.error('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(user.email);
      setResetSent(true);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Could not send reset email. Please try again.');
    }
  };

  const firstName = profile?.firstName ?? user?.displayName?.split(' ')[0] ?? 'User';
  const lastName  = profile?.lastName  ?? user?.displayName?.split(' ').slice(1).join(' ') ?? '';
  const fullName  = `${firstName}${lastName ? ' ' + lastName : ''}`;
  const initial   = firstName[0]?.toUpperCase() ?? 'U';
  const role      = profile?.role ?? 'learner';

  const joinedDate = profile?.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="-mx-6 -mt-6 min-h-[calc(100vh-64px)]" style={{ background: '#f3f4f6' }}>

      {/* ── Profile Banner ── */}
      <div className="bg-[#0d1d40] px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg shrink-0">
            {initial}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{fullName}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 flex-wrap">
              <span className="text-gray-300 text-sm">{user?.email}</span>
              <span className={`text-xs font-semibold px-3 py-0.5 rounded-full ${
                role === 'admin' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
              }`}>
                {role === 'admin' ? 'Administrator' : 'Learner'}
              </span>
            </div>
            {joinedDate && (
              <p className="text-gray-400 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Calendar size={12} /> Member since {joinedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-[#152b5e] px-6 py-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {statsLoading ? (
            [1,2,3].map((i) => (
              <div key={i} className="h-12 bg-white/10 rounded animate-pulse" />
            ))
          ) : (
            <>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-gray-300 mt-0.5">Enrolled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">{stats.inProgress}</p>
                <p className="text-xs text-gray-300 mt-0.5">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                <p className="text-xs text-gray-300 mt-0.5">Completed</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={18} className="text-orange-500" />
              <h2 className="font-bold text-gray-900">Personal Information</h2>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>

          <div className="px-6 py-5">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                    <input
                      className="input-field"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                    <input
                      className="input-field"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
                  >
                    <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setForm({ firstName: profile?.firstName ?? '', lastName: profile?.lastName ?? '' }); }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoField label="First name" value={profile?.firstName ?? '—'} />
                <InfoField label="Last name"  value={profile?.lastName  ?? '—'} />
                <InfoField label="Email address" value={user?.email ?? '—'} icon={<Mail size={14} className="text-gray-400" />} />
                <InfoField label="Role" value={role === 'admin' ? 'Administrator' : 'Learner'} icon={<Shield size={14} className="text-gray-400" />} />
              </div>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <KeyRound size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">Security</h2>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {resetSent
                  ? 'A reset link was sent to your email address.'
                  : 'Send a password reset link to your email address.'}
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={resetSent}
              className={`shrink-0 text-sm font-semibold px-5 py-2 rounded-lg transition ${
                resetSent
                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {resetSent ? '✓ Email sent' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BookOpen size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">My Learning</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <QuickLink to="/my-courses" icon={<BookOpen size={16} className="text-blue-500" />}
              label="My Courses" sub={`${stats.total} course${stats.total !== 1 ? 's' : ''} enrolled`} />
            <QuickLink to="/certificates" icon={<Award size={16} className="text-yellow-500" />}
              label="Certificates" sub={`${stats.completed} certificate${stats.completed !== 1 ? 's' : ''} earned`} />
            <QuickLink to="/catalog" icon={<CheckCircle size={16} className="text-green-500" />}
              label="Browse Catalog" sub="Discover new courses" />
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoField({ label, value, icon }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label, sub }) {
  return (
    <Link to={to} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 shrink-0" />
    </Link>
  );
}
