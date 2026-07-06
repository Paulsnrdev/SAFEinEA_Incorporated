import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ui/ProtectedRoute';

// Layouts
import PublicLayout  from './components/layout/PublicLayout';
import AppLayout     from './components/layout/AppLayout';
import PlayerLayout  from './components/layout/PlayerLayout';

// Public pages
import PublicHome      from './pages/public/PublicHome';
import PublicDashboard from './pages/public/PublicDashboard';
import CartPage        from './pages/CartPage';
import CheckoutPage    from './pages/CheckoutPage';

// Auth pages
import Login          from './pages/auth/Login';
import Signup         from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Learner pages
import LearnerDashboard from './pages/learner/LearnerDashboard';
import CourseCatalog    from './pages/learner/CourseCatalog';
import CourseDetail     from './pages/learner/CourseDetail';
import MyCourses        from './pages/learner/MyCourses';
import CoursePlayer     from './pages/learner/CoursePlayer';
import ProfilePage      from './pages/learner/ProfilePage';

// Admin pages
import AdminDashboard  from './pages/admin/AdminDashboard';
import ManageCourses   from './pages/admin/ManageCourses';
import CourseForm      from './pages/admin/CourseForm';
import LessonManager   from './pages/admin/LessonManager';
import AdminUsers      from './pages/admin/AdminUsers';
import AdminAnalytics  from './pages/admin/AdminAnalytics';
import AdminSettings   from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            {/* Root landing page — standalone (no layout wrapper) */}
            <Route path="/" element={<PublicHome />} />

            {/* Public — with header/footer */}
            <Route element={<PublicLayout />}>
              <Route path="/home" element={<PublicDashboard />} />
            </Route>

            {/* Cart & Checkout — standalone, no auth required */}
            <Route path="/cart"     element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Auth — full-screen, no layout wrapper */}
            <Route path="/login"          element={<Login />} />
            <Route path="/signup"         element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated learner area — sidebar layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard"   element={<LearnerDashboard />} />
              <Route path="/catalog"    element={<CourseCatalog />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/profile"    element={<ProfilePage />} />
              <Route path="/certificates" element={<div className="card"><h2 className="font-bold text-lg">Certificates</h2><p className="text-gray-500 text-sm mt-2">Certificates page coming soon.</p></div>} />
              <Route path="/news"       element={<div className="card"><h2 className="font-bold text-lg">News</h2><p className="text-gray-500 text-sm mt-2">News page coming soon.</p></div>} />
              <Route path="/leaderboards" element={<div className="card"><h2 className="font-bold text-lg">Leaderboards</h2><p className="text-gray-500 text-sm mt-2">Leaderboards coming soon.</p></div>} />
            </Route>

            {/* Admin area */}
            <Route
              element={
                <ProtectedRoute adminOnly>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin"                    element={<AdminDashboard />} />
              <Route path="/admin/courses"            element={<ManageCourses />} />
              <Route path="/admin/courses/new"          element={<CourseForm />} />
              <Route path="/admin/courses/:id/edit"    element={<CourseForm />} />
              <Route path="/admin/courses/:id/lessons" element={<LessonManager />} />
              <Route path="/admin/users"              element={<AdminUsers />} />
              <Route path="/admin/analytics"          element={<AdminAnalytics />} />
              <Route path="/admin/settings"           element={<AdminSettings />} />
            </Route>

            {/* Course player — authenticated, no sidebar */}
            <Route
              element={
                <ProtectedRoute>
                  <PlayerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/learn/:courseId/lesson/:lessonId" element={<CoursePlayer />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
