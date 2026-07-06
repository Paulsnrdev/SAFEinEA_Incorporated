import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Search, Award, BarChart2,
  Users, Settings, X, Newspaper, Trophy,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/uiSlice';
import { useAuth } from '../../context/AuthContext';

const learnerLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/catalog',   icon: Search,          label: 'Course Catalog' },
  { to: '/my-courses',icon: BookOpen,        label: 'My Courses' },
  { to: '/certificates', icon: Award,        label: 'Certificates' },
  { to: '/news',      icon: Newspaper,       label: 'News' },
  { to: '/leaderboards', icon: Trophy,       label: 'Leaderboards' },
];

const adminLinks = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Admin Home' },
  { to: '/admin/courses',   icon: BookOpen,        label: 'Manage Courses' },
  { to: '/admin/users',     icon: Users,           label: 'Manage Users' },
  { to: '/admin/analytics', icon: BarChart2,       label: 'Analytics' },
  { to: '/admin/settings',  icon: Settings,        label: 'Settings' },
];

export default function Sidebar() {
  const { profile } = useAuth();
  const open       = useSelector((s) => s.ui.sidebarOpen);
  const dispatch   = useDispatch();
  const isAdmin    = profile?.role === 'admin';
  const links      = isAdmin ? adminLinks : learnerLinks;

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30 transition-all duration-300 flex flex-col
          ${open ? 'w-60' : 'w-0 md:w-16'} overflow-hidden`}
      >
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={`${open ? 'block' : 'hidden'} whitespace-nowrap`}>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
