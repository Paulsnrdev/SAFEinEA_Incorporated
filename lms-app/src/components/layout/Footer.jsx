import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <BookOpen size={22} />
            Treasure Base Academy
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Online safety training platform by SAFEinEA Incorporated — delivering
            workplace health, safety, and environmental courses across Canada.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className="hover:text-white transition-colors">Course Catalog</Link></li>
            <li><Link to="/login"   className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link to="/signup"  className="hover:text-white transition-colors">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>SAFEinEA Incorporated</li>
            <li>Canada</li>
            <li><a href="mailto:info@safeinea.ca" className="hover:text-white transition-colors">info@safeinea.ca</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} SAFEinEA Incorporated. All rights reserved.
      </div>
    </footer>
  );
}
