import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

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
          <Link to="/search" className={linkClass("/search")}>Search</Link>
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>Dashboard</Link>
          {/* <Link to="/admin/analytics" className={linkClass("/admin/analytics")}>Analytics</Link> */}
          <Link to="/admin/profile" className={linkClass("/admin/profile")}>Profile</Link>

          <button
            onClick={handleLogout}
            className="ml-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Logout
          </button>
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
            <Link className={mobileLinkClass("/admin/dashboard")} to="/admin/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            {/* <Link className={mobileLinkClass("/admin/analytics")} to="/admin/analytics" onClick={() => setOpen(false)}>Analytics</Link> */}
            <Link className={mobileLinkClass("/admin/profile")} to="/admin/profile" onClick={() => setOpen(false)}>Profile</Link>

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;