import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const GuestNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 text-lg uppercase ${location.pathname === path
      ? "font-bold text-indigo-600"
      : "text-gray-700"
    } hover:text-indigo-600`;

  const mobileLinkClass = (path) =>
    `px-3 py-2 text-md uppercase ${location.pathname === path
      ? "font-bold text-indigo-600"
      : "text-gray-700"
    } hover:text-indigo-600`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white h-20 shadow">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/image/navbar-logo.png"
            alt="EduHub Logo"
            className="h-10"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-2 ml-auto">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>
          <Link to="/search" className={linkClass("/search")}>Search</Link>
          <Link to="/courses" className={linkClass("/courses")}>Courses</Link>
          <Link to="/contact-us" className={linkClass("/contact-us")}>Contact Us</Link>
          <Link to="/signup" className={linkClass("/signup")}>Signup</Link>

          <Link
            to="/login"
            className="ml-3 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Login
          </Link>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col px-4 py-2">
            <Link className={mobileLinkClass("/")} to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link className={mobileLinkClass("/search")} to="/search" onClick={() => setOpen(false)}>Search</Link>
            <Link className={mobileLinkClass("/courses")} to="/courses" onClick={() => setOpen(false)}>Courses</Link>
            <Link className={mobileLinkClass("/contact-us")} to="/contact-us" onClick={() => setOpen(false)}>Contact Us</Link>
            <Link className={mobileLinkClass("/about")} to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link className={mobileLinkClass("/signup")} to="/signup" onClick={() => setOpen(false)}>Signup</Link>
            <Link className={mobileLinkClass("/login")} to="/login" onClick={() => setOpen(false)}>Login</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default GuestNavbar;