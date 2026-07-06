import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../../firebase/adminService';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Shield, ShieldOff, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all'); // all | learner | admin
  const [changing, setChanging] = useState(null); // uid being changed

  const load = async () => {
    setLoading(true);
    const all = await getAllUsers();
    setUsers(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (uid, currentRole) => {
    const newRole = currentRole === 'admin' ? 'learner' : 'admin';
    const label   = newRole === 'admin' ? 'Administrator' : 'Learner';
    if (!confirm(`Change this user's role to ${label}?`)) return;
    setChanging(uid);
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role: newRole } : u));
      toast.success(`Role changed to ${label}.`);
    } catch {
      toast.error('Failed to update role. Please try again.');
    } finally {
      setChanging(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (u.firstName ?? '').toLowerCase().includes(q) ||
      (u.lastName  ?? '').toLowerCase().includes(q) ||
      (u.email     ?? '').toLowerCase().includes(q);
    const matchRole = filter === 'all' || u.role === filter;
    return matchSearch && matchRole;
  });

  const totalAdmins   = users.filter((u) => u.role === 'admin').length;
  const totalLearners = users.filter((u) => u.role !== 'admin').length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm">View and manage all registered users.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Users"  value={users.length}   color="bg-purple-50 text-purple-600" />
        <StatCard label="Learners"     value={totalLearners}  color="bg-blue-50 text-blue-600" />
        <StatCard label="Admins"       value={totalAdmins}    color="bg-orange-50 text-orange-600" />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="bg-transparent outline-none text-sm flex-1 text-gray-800"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'learner', 'admin'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  filter === f
                    ? 'bg-[#152b5e] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'admin' ? 'Admins' : 'Learners'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No users match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Joined</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => {
                  const name    = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || 'Unknown';
                  const initial = name[0]?.toUpperCase() ?? '?';
                  const isMe    = u.uid === currentUser?.uid;
                  const joined  = u.createdAt?.toDate
                    ? u.createdAt.toDate().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
                    : '—';

                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 truncate max-w-[140px]">
                              {name} {isMe && <span className="text-xs text-gray-400 font-normal">(you)</span>}
                            </p>
                            <p className="text-xs text-gray-400 md:hidden truncate max-w-[140px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500 hidden md:table-cell truncate max-w-[200px]">
                        {u.email}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? <Shield size={11} /> : null}
                          {u.role === 'admin' ? 'Admin' : 'Learner'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs hidden sm:table-cell">{joined}</td>
                      <td className="py-3 text-right">
                        {isMe ? (
                          <span className="text-xs text-gray-300">—</span>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u.uid, u.role)}
                            disabled={changing === u.uid}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                              u.role === 'admin'
                                ? 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600'
                                : 'bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-orange-600'
                            }`}
                          >
                            {changing === u.uid ? (
                              'Saving…'
                            ) : u.role === 'admin' ? (
                              <><ShieldOff size={12} /> Remove Admin</>
                            ) : (
                              <><Shield size={12} /> Make Admin</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-3">{filtered.length} user{filtered.length !== 1 ? 's' : ''} shown</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Users size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
