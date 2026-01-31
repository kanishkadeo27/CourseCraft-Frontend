import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();
   
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TOP ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* LOGO + ABOUT */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div 
                  className="h-16 w-auto bg-white rounded-lg p-2 shadow-sm border border-gray-200"
                  style={{ display: 'inline-block' }}
                >
                  <img
                    src="/image/navbar-logo.png"
                    alt="CourseCraft"
                    className="h-full w-auto object-contain"
                    onError={(e) => {
                      e.target.parentElement.style.display = 'none';
                      e.target.parentElement.nextSibling.style.display = 'block';
                    }}
                  />
                </div>
                <div className="hidden">
                  <h2 className="text-2xl font-bold text-indigo-600">CourseCraft</h2>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm mb-6">
                CourseCraft is your gateway to quality education. We provide comprehensive courses 
                and learning resources to help you achieve your academic and professional goals.
              </p>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 relative">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5 text-indigo-500">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">projectmail027@gmail.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5 text-indigo-500">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">+91 6264547523</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5 text-indigo-500">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">CDAC Panchwati, Pune,<br />411008, Maharashtra, India</p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </h4>

            {/* ================= GUEST MENU ================= */}
            {!user && (
              <div className="space-y-3">
                <Link to="/" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  🏠 Home
                </Link>
                <Link to="/about" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  ℹ️ About
                </Link>
                <Link to="/search" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  🔍 Search
                </Link>
                <Link to="/courses" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  📚 Courses
                </Link>
                <Link to="/contact-us" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  📞 Contact Us
                </Link>
                <Link to="/signup" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  ✨ Signup
                </Link>
              </div>
            )}

            {/* ================= USER MENU ================= */}
            {userRole === "user" && (
              <div className="space-y-3">
                <Link to="/" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  🏠 Home
                </Link>
                <Link to="/search" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  🔍 Search
                </Link>
                <Link to="/courses" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  📚 Courses
                </Link>
                <Link to="/user/my-courses" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  🎓 My Courses
                </Link>
                <Link to="/user/profile" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  👤 Profile
                </Link>
                <Link to="/contact-us" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  📞 Contact Us
                </Link>
              </div>
            )}

            {/* ================= ADMIN MENU ================= */}
            {userRole === "admin" && (
              <div className="space-y-3">
                <Link to="/" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  🏠 Home
                </Link>
                <Link to="/admin/dashboard" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  📊 Dashboard
                </Link>
                <Link to="/admin/courses/create" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  ➕ Add Course
                </Link>
                <Link to="/admin/manage-courses" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  📚 Manage Courses
                </Link>
                <Link to="/admin/trainers" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  👨‍🏫 Manage Trainers
                </Link>
                <Link to="/admin/users" className="block text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-sm">
                  👥 Manage Users
                </Link>
              </div>
            )}
          </div>

          {/* QUICK INFO */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 relative">
              Quick Info
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <p className="text-gray-900 font-medium text-xs">Categories: Programming, Web Dev, Data Science</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zM18.82 9L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <p className="text-gray-900 font-medium text-xs">Students: 1000+</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11S11 10.1 11 9V7.5L5 7V9C5 10.1 4.1 11 3 11S1 10.1 1 9V7C1 5.9 1.9 5 3 5H21C22.1 5 23 5.9 23 7V9C23 10.1 22.1 11 21 11S19 10.1 19 9Z"/>
                  </svg>
                </div>
                <p className="text-gray-900 font-medium text-xs">Instructors: 50+</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                  </svg>
                </div>
                <p className="text-gray-900 font-medium text-xs">Support: Mon-Fri 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-300 mb-6"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-600 text-sm">
            Copyright © 2026 <span className="text-indigo-600 font-medium">CourseCraft</span>. All rights reserved
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Terms of Use
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;