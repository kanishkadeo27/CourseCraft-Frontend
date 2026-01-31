import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const GuestNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
          <Link to="/about" className={linkClass("/about")}>About</Link>
          <Link to="/search" className={linkClass("/search")}>Search</Link>
          <Link to="/courses" className={linkClass("/courses")}>Courses</Link>
          <Link to="/contact-us" className={linkClass("/contact-us")}>Contact Us</Link>
          <Link to="/signup" className={linkClass("/signup")}>Signup</Link>

          <Link
            to="/login"
            className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </Link>
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
            <Link className={mobileLinkClass("/contact-us")} to="/contact-us" onClick={() => setOpen(false)}>Contact Us</Link>
            <Link className={mobileLinkClass("/about")} to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link className={mobileLinkClass("/signup")} to="/signup" onClick={() => setOpen(false)}>Signup</Link>
            
            <div className="px-4 py-3">
              <Link 
                className="block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md" 
                to="/login" 
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default GuestNavbar;