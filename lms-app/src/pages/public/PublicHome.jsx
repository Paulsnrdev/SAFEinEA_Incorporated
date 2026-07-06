import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { addToCart, selectCartItems, selectCartCount } from '../../store/cartSlice';
import { COURSES } from '../../data/courses';
import toast from 'react-hot-toast';
import {
  Search, Menu, X, ChevronLeft, ChevronRight, ShoppingCart,
  BookOpen, Key, ExternalLink, Globe, AlertTriangle, Check,
} from 'lucide-react';

export default function PublicHome() {
  const { user, profile, logout } = useAuth();
  const dispatch   = useDispatch();
  const cartItems  = useSelector(selectCartItems);
  const cartCount  = useSelector(selectCartCount);
  const navigate   = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const trackRef = useRef(null);

  const displayName = profile
    ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
    : (user?.displayName ?? '');
  const firstName = profile?.firstName
    || user?.displayName?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'there';
  const initial = firstName[0]?.toUpperCase() ?? '?';

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  const handleAddToCart = (course) => {
    const alreadyIn = cartItems.some((i) => i.id === course.id);
    if (alreadyIn) {
      navigate('/cart');
      return;
    }
    dispatch(addToCart({
      id:        course.id,
      title:     course.title,
      type:      course.type,
      price:     course.price,
      priceStr:  course.priceStr,
      img:       course.img,
      stripeLink: course.stripeLink,
    }));
    toast.success(`"${course.title}" added to cart!`, { duration: 3000 });
  };

  return (
    <div className="bg-white overflow-x-hidden min-h-screen flex flex-col" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#152b5e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img
                src="/SAFEinEA-Logo.jpg"
                alt="Treasure Base Academy"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-contain bg-white p-0.5"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="hidden sm:block">
                <div className="text-white text-xs font-semibold leading-tight opacity-80">Treasure Base Academy</div>
                <div className="text-white text-xs opacity-60">SAFEinEA LMS</div>
              </div>
            </Link>

            {/* Right controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-orange-400 hover:text-orange-300 transition p-1"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative text-white hover:text-orange-300 transition p-1" aria-label="Cart">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth button */}
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-white hover:text-orange-300 transition text-sm font-medium"
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', background: '#f97316',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0,
                  }}>
                    {initial}
                  </div>
                  <span className="hidden sm:block">{firstName}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2 rounded-md transition"
                >
                  Login
                </Link>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="text-white hover:text-gray-300 transition p-1"
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <div className="flex items-center gap-2 bg-white rounded-lg overflow-hidden px-3 py-2">
                <Search size={15} className="text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search courses…"
                  className="flex-1 outline-none text-sm text-gray-800"
                  onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileOpen(false)} />
        )}

        {/* Mobile drawer */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              <X size={22} />
            </button>
            <div className="mt-10 space-y-3">
              <Link to="/"             onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-800 hover:text-orange-500 hover:bg-orange-50 rounded-lg">Home</Link>
              <a    href="#catalog"    onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-800 hover:text-orange-500 hover:bg-orange-50 rounded-lg">Catalog</a>
              <a    href="#enrollment-key" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-800 hover:text-orange-500 hover:bg-orange-50 rounded-lg">Enrollment Key</a>
              <Link to="/cart"         onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-orange-500 hover:bg-orange-50 rounded-lg">
                <ShoppingCart size={16} /> Cart {cartCount > 0 && <span className="ml-auto bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition">
                      Back to Dashboard
                    </Link>
                    <button
                      onClick={async () => { setMobileOpen(false); await logout(); navigate('/'); }}
                      className="block w-full text-center py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== GOLD BAND ===== */}
      <div className="relative flex items-center" style={{ backgroundColor: '#b8960c', minHeight: 64 }}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 shadow-lg flex items-center justify-center overflow-hidden border-2 border-yellow-600">
              <img src="/SAFEinEA-Logo.jpg" alt="SAFEinEA" className="w-full h-full object-contain rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden py-10 sm:py-14 md:py-16" style={{ backgroundColor: '#152b5e' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 leading-snug drop-shadow-lg">
            Welcome To The Treasure Base Academy | SAFEinEA LMS
          </h1>
          <div className="inline-block relative px-8 py-5">
            <div className="absolute inset-0 rounded-xl opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
            <div className="relative z-10">
              <div className="text-white text-2xl sm:text-3xl font-black tracking-wider uppercase leading-tight">
                TREASURE BASE<br />ACADEMY
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-px w-6 bg-yellow-400" />
                <p className="text-yellow-300 text-[10px] sm:text-xs uppercase tracking-widest font-medium">
                  Where Learning Meets Convenience and Self Paced
                </p>
                <div className="h-px w-6 bg-yellow-400" />
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <>
                <p className="text-white text-sm opacity-80">
                  Welcome back, <span className="font-bold text-yellow-300">{firstName}</span>!
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-lg transition shadow-lg"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-lg transition shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 border border-white text-white hover:bg-white hover:text-navy font-bold px-7 py-3 rounded-lg transition"
                  style={{ '--tw-text-opacity': 1 }}
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== CATALOG ===== */}
      <section id="catalog" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Catalog</h2>
            {cartCount > 0 && (
              <Link to="/cart" className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition">
                <ShoppingCart size={16} /> View Cart ({cartCount})
              </Link>
            )}
          </div>

          <div className="relative">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-9 h-9 rounded-full items-center justify-center shadow-md transition hover:opacity-90" style={{ background: '#f97316', color: '#fff', border: 'none' }}>
              <ChevronLeft size={15} />
            </button>

            <div ref={trackRef} className="flex gap-5 overflow-x-auto pb-5 pt-3 px-1" style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {COURSES.map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  inCart={cartItems.some((i) => i.id === c.id)}
                  onAction={() => handleAddToCart(c)}
                />
              ))}
            </div>

            <button onClick={() => scroll(1)} aria-label="Scroll right" className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-9 h-9 rounded-full items-center justify-center shadow-md transition hover:opacity-90" style={{ background: '#f97316', color: '#fff', border: 'none' }}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link to="/catalog" className="feature-card group block">
              <FeatureCard bg="/Safeinea storefront.jpg" iconBg="bg-amber-50" icon={<BookOpen className="text-orange-500" size={30} />} title="Catalog" subtitle="SAFEinEA Incorporated" desc="See a complete list of available courses" />
            </Link>
            <div id="enrollment-key" className="feature-card group cursor-default">
              <FeatureCard bg="/Safety Homepage.jpg" iconBg="bg-yellow-50" icon={<Key className="text-yellow-500" size={30} />} title="Enrollment Key" desc="Enrollment Key" />
            </div>
            <a href="/index.html#contact" className="feature-card group block">
              <FeatureCard bg="/community1.jpg" iconBg="bg-blue-50" icon={<ExternalLink className="text-blue-700" size={26} />} title="Need Help?" desc="Click to check out this link" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-4 mt-auto" style={{ backgroundColor: '#0d1d40' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm">
            <Globe size={18} /> <span className="font-medium">EN</span>
          </button>
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-black">S</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .feature-card {
          position: relative; overflow: hidden; border-radius: 12px;
          background: #f0f4ff; min-height: 180px;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 10px; padding: 28px 20px; text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.14); }
      `}</style>
    </div>
  );
}

/* ---- Sub-components ---- */

function CourseCard({ course, inCart, onAction }) {
  const fallbackBg = { 5: '#374151', 2: '#b91c1c', 4: '#1d4ed8', 6: '#065f46', 9: '#1e3a5f', 7: '#1e3a5f' }[course.id] ?? '#dbeafe';

  return (
    <div className="shrink-0 bg-white rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1" style={{ width: 220, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 145, background: fallbackBg }}>
        {course.img && (
          <img src={`/${course.img}`} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        )}
        {course.id === 5 && !course.img && (
          <div className="w-full h-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-yellow-400 opacity-70" />
          </div>
        )}
        {course.lessons != null ? (
          <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ background: '#d4a017' }}>
            {course.lessons}
          </div>
        ) : course.check ? (
          <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md" style={{ background: '#3b82f6' }}>
            <Check size={12} />
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="p-3 flex-1">
        <p className="text-sm font-bold text-slate-800 leading-snug mb-1">{course.title}</p>
        <p className="text-xs text-gray-500">{course.type}</p>
      </div>

      {/* Footer */}
      <div className="px-3.5 pb-3.5">
        <button
          onClick={onAction}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-md text-white text-sm font-bold transition"
          style={{ background: inCart ? '#16a34a' : '#f97316' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = inCart ? '#15803d' : '#ea6c00'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = inCart ? '#16a34a' : '#f97316'; }}
        >
          {inCart ? (
            <><span>In Cart</span><ShoppingCart size={14} /></>
          ) : (
            <><span>{course.priceStr}</span><ShoppingCart size={14} /></>
          )}
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ bg, iconBg, icon, title, subtitle, desc }) {
  return (
    <>
      <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" onError={(e) => { e.target.style.display = 'none'; }} style={{ pointerEvents: 'none' }} />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition`}>
          {icon}
        </div>
        <div>
          <div className="text-lg font-black text-gray-800 uppercase tracking-wide">{title}</div>
          {subtitle && <div className="text-sm text-gray-400 mt-0.5">{subtitle}</div>}
          <div className="text-sm text-gray-500 mt-1">{desc}</div>
        </div>
      </div>
    </>
  );
}
