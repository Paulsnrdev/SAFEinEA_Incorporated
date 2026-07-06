import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, resetPassword } from '../../firebase/authService';
import { User, KeyRound, Save, Edit2, X, Bell, Globe, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user, profile, refreshProfile } = useAuth();

  // Profile editing
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '' });

  // Password reset
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ firstName: profile.firstName ?? '', lastName: profile.lastName ?? '' });
    }
  }, [profile]);

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
      toast.error('Could not save. Please try again.');
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
      toast.error('Could not send reset email.');
    }
  };

  const firstName = profile?.firstName ?? '';
  const lastName  = profile?.lastName  ?? '';
  const fullName  = `${firstName} ${lastName}`.trim() || 'Admin';
  const initial   = fullName[0]?.toUpperCase() ?? 'A';
  const joinedDate = profile?.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your admin account and preferences.</p>
      </div>

      {/* Admin Account Card */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initial}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{fullName}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={12} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-600">Administrator</span>
              {joinedDate && <span className="text-xs text-gray-400">· Member since {joinedDate}</span>}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              <h3 className="font-semibold text-gray-900">Personal Information</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
                  value={user?.email ?? ''}
                  disabled
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
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
                  onClick={() => {
                    setEditing(false);
                    setForm({ firstName: profile?.firstName ?? '', lastName: profile?.lastName ?? '' });
                  }}
                  className="flex items-center gap-2 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingRow label="First name" value={profile?.firstName ?? '—'} />
              <SettingRow label="Last name"  value={profile?.lastName  ?? '—'} />
              <SettingRow label="Email"      value={user?.email ?? '—'} />
              <SettingRow label="Role"       value="Administrator" />
            </div>
          )}
        </div>

        {/* Security */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound size={16} className="text-orange-500" />
            <h3 className="font-semibold text-gray-900">Security</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800">Password</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {resetSent
                  ? 'Reset link sent to your email.'
                  : 'Send a password reset link to your email.'}
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={resetSent}
              className={`shrink-0 text-sm font-semibold px-5 py-2 rounded-lg transition ${
                resetSent
                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {resetSent ? '✓ Email sent' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Platform Settings (display) */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={16} className="text-orange-500" />
          <h3 className="font-semibold text-gray-900">Platform Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingRow label="Platform name" value="Treasure Base Academy" />
          <SettingRow label="LMS version"   value="1.0.0" />
          <SettingRow label="Firebase project" value="safeinea-academy" />
          <SettingRow label="Region" value="Canada" />
        </div>
      </div>

      {/* Notifications (UI only) */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-orange-500" />
          <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          <ToggleRow label="New user registrations"    defaultOn={true} />
          <ToggleRow label="Course enrollment alerts"  defaultOn={true} />
          <ToggleRow label="Course completion reports" defaultOn={false} />
          <ToggleRow label="Weekly summary emails"     defaultOn={false} />
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function ToggleRow({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700">{label}</p>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-orange-500' : 'bg-gray-200'}`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
