import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, LogOut, User, ChevronDown, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/uiSlice';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 h-16" style={{ background: '#152b5e' }}>
      <div className="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">

        {/* Left – hamburger + logo */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <BookOpen size={24} className="text-orange-400" />
            <span className="hidden sm:block text-white font-bold text-base">Treasure Base Academy</span>
          </Link>
        </div>

        {/* Center – search (authenticated only) */}
        {user && (
          <div className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-2 w-64 border border-white/10">
            <Search size={15} className="text-gray-400 mr-2 shrink-0" />
            <input
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-white"
              placeholder="Search courses..."
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/catalog?q=${e.target.value}`)}
            />
          </div>
        )}

        {/* Right – icons + user */}
        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              {/* Mobile search icon */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
                onClick={() => navigate('/catalog')}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition relative" aria-label="Notifications">
                <Bell size={20} />
              </button>

              {/* User avatar + dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {profile?.firstName?.[0] ?? user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-200">
                    {profile?.firstName ?? 'Account'}
                  </span>
                  <ChevronDown size={15} className="text-gray-400 hidden md:block" />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                Sign in
              </Link>
              <Link to="/signup" className="text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg transition">
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
