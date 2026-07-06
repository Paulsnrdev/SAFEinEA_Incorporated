import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/coursesSlice';
import CourseCard from '../../components/course/CourseCard';
import { Shield, Award, Users, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  { icon: Shield,    title: 'Safety Compliance',   desc: 'Workplace health & safety courses aligned with Canadian standards.' },
  { icon: Award,     title: 'Accredited Training',  desc: 'SAFE Work Manitoba endorsed courses with certificates.' },
  { icon: Users,     title: 'Team Learning',        desc: 'Enroll whole departments and track team progress.' },
  { icon: BookOpen,  title: 'On-Demand Access',     desc: 'Learn at your own pace, anytime, any device.' },
];

const BENEFITS = [
  'Reduce workplace incidents',
  'Stay compliant with regulations',
  'Digital certificates & records',
  'Progress tracking & reporting',
  'Available 24/7 online',
];

export default function PublicDashboard() {
  const dispatch = useDispatch();
  const { list: courses, loading } = useSelector((s) => s.courses);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchCourses({ published: true }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-brand-green text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-6">
            <Shield size={14} /> SAFE Work Manitoba Endorsed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Professional Safety Training<br />
            <span className="text-brand-yellow">Built for Canadian Workplaces</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Treasure Base Academy delivers accredited workplace health, safety, and
            environmental training — from compliance courses to professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="bg-white text-primary-800 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
              Browse Courses <ArrowRight size={18} />
            </Link>
            {user ? (
              <Link to="/dashboard" className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signup" className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-dark text-white py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[['500+', 'Learners Trained'], ['50+', 'Safety Courses'], ['98%', 'Completion Rate'], ['10+', 'Years of Expertise']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-bold text-brand-yellow">{num}</div>
              <div className="text-sm text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Choose Treasure Base Academy?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-xl mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
            <Link to="/catalog" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse h-64">
                  <div className="bg-gray-200 h-36 rounded-lg mb-4" />
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>Courses coming soon.{!user && <> <Link to="/signup" className="text-primary-600 underline">Register to be notified.</Link></>}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA + Benefits */}
      <section className="py-16 px-6 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Start Learning Today</h2>
            <ul className="space-y-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-primary-100">
                  <CheckCircle size={16} className="text-brand-yellow flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-shrink-0 text-center">
            {user ? (
              <>
                <p className="text-primary-200 mb-4">Welcome back!</p>
                <Link to="/dashboard" className="bg-brand-yellow text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors inline-block">
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <p className="text-primary-200 mb-4">Ready to get started?</p>
                <Link to="/signup" className="bg-brand-yellow text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors inline-block">
                  Register Free
                </Link>
                <p className="text-xs text-primary-300 mt-3">No credit card required</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
