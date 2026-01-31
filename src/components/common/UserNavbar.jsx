import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setOpen(false); // Close mobile menu immediately
    try {
      await logout();
      // Navigate to home after logout
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to home even if logout fails
      navigate("/", { replace: true });
    }
  };

  const linkClass = (path) =>
    `px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${location.pathname === path
      ? "text-indigo-600 border-b-2 border-indigo-600"
      : "text-gray-700 hover:text-indigo-600"
    }`;

  const mobileLinkClass = (path) =>
    `block px-4 py-3 text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${location.pathname === path
      ? "text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600"
      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/image/navbar-logo.png"
            alt="CourseCraft Logo"
            className="h-16"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-1 ml-auto">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/search" className={linkClass("/search")}>Search</Link>
          <Link to="/courses" className={linkClass("/courses")}>Courses</Link>
          <Link to="/user/my-courses" className={linkClass("/user/my-courses")}>My Courses</Link>
          <Link to="/user/profile" className={linkClass("/user/profile")}>Profile</Link>
          <Link to="/contact-us" className={linkClass("/contact-us")}>Contact Us</Link>

          <button
            onClick={handleLogout}
            className="ml-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-full font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <nav className="py-2">
            <Link className={mobileLinkClass("/")} to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link className={mobileLinkClass("/search")} to="/search" onClick={() => setOpen(false)}>Search</Link>
            <Link className={mobileLinkClass("/courses")} to="/courses" onClick={() => setOpen(false)}>Courses</Link>
            <Link className={mobileLinkClass("/user/my-courses")} to="/user/my-courses" onClick={() => setOpen(false)}>My Courses</Link>
            <Link className={mobileLinkClass("/user/profile")} to="/user/profile" onClick={() => setOpen(false)}>Profile</Link>
            <Link className={mobileLinkClass("/contact-us")} to="/contact-us" onClick={() => setOpen(false)}>Contact Us</Link>

            <div className="px-4 py-3">
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-center bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;