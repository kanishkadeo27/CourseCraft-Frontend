import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  // Get user from AuthContext
  const { user } = useAuth();

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // Reset display text when user changes
    setDisplayText("");
    
    const targetText = user?.name ? `${user.name}!` : "guest!";
    let index = 0;

    const interval = setInterval(() => {
      if (index < targetText.length) {
        setDisplayText(targetText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [user?.name]); // Only depend on user.name to avoid unnecessary re-runs

  return (
    <section className="text-gray-700">

      {/* ================= WELCOME ================= */}
      <h1 className="text-3xl sm:text-4xl font-medium text-center text-gray-900 mt-28">
        {user ? (
          <>
            Welcome, <span className="text-indigo-600">{displayText}</span>
          </>
        ) : (
          <>
            Hello, <span className="text-indigo-600">{displayText}</span>
          </>
        )}
      </h1>

      {/* ================= HERO ================= */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">

        {/* LEFT CONTENT */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-6">
            Unlock Your Potential:
            <br />
            <span className="text-indigo-600">
              Empowering Growth through Online Learning
            </span>
          </h1>

          <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
            Discover boundless opportunities with our online learning platform.
            Unlock your true potential and embrace continuous growth, all from
            the comfort of your home.
          </p>

          {user ? (
            <Link
              to="/search"
              className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded transition"
            >
              Search →
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded transition"
            >
              Login →
            </Link>
          )}
        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <img
            className="w-full max-w-lg rounded shadow"
            src="/image/home.jpg"
            alt="Online Learning"
          />
        </div>
      </div>

      {/* ================= DIVIDER ================= */}
      <div className="w-full h-px bg-gray-300 my-16" />

      {/* ================= FOUNDER ================= */}
      <div className="max-w-md mx-auto text-center mb-20">
        <img
          src="/image/cdac.jpg"
          alt="Founder"
          className="mx-auto rounded-full w-36 h-36 object-cover border"
        />
        <h3 className="mt-4 text-2xl font-semibold">CDAC</h3>
        <p className="text-gray-500 text-lg">Founder, EduHub</p>
      </div>

      {/* ================= COMPANIES ================= */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 pb-24 text-center">
        <div>
          <img
            src="/image/amdocs-logo.svg.png"
            alt="Amdocs"
            className="mx-auto h-12"
          />
          <p className="mt-3 text-lg">Ex-Amdocs, SWE</p>
        </div>

        <div>
          <img
            src="/image/1280px-Sears_logo_(2020).svg.png"
            alt="Sears"
            className="mx-auto h-12"
          />
          <p className="mt-3 text-lg">Ex-Sears Holdings, SWE</p>
        </div>

        <div>
          <img
            src="/image/Nike-Logo.png"
            alt="Nike"
            className="mx-auto h-12"
          />
          <p className="mt-3 text-lg">Currently @ Nike</p>
        </div>
      </div>

    </section>
  );
};

export default Home;
