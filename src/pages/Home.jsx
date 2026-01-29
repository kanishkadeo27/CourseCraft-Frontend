import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  // Get user from AuthContext
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();

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
            userRole === "admin" ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded transition"
              >
                Dashboard →
              </Link>
            ) : (
              <Link
                to="/search"
                className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded transition"
              >
                Search →
              </Link>
            )
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
      <div className="max-w-4xl mx-auto text-center mb-20 px-6">
        <div className="mb-8">
          <div className="relative mx-auto w-96 h-56 overflow-hidden rounded-xl shadow-2xl border-4 border-white">
            <img
              src="/image/HomePage/founders_image.jpeg"
              alt="EduHub Founders"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              style={{ objectPosition: '50% 25%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Founders</h3>
        <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
          Passionate educators and technology enthusiasts dedicated to making quality education accessible to everyone.
        </p>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mx-4 shadow-lg border border-indigo-100">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            "Our mission is to bridge the gap between traditional education and modern technology, 
            creating an inclusive learning environment where every student can thrive and achieve their dreams."
          </p>
          <p className="text-indigo-600 font-semibold mt-4 text-lg">- EduHub Founding Team</p>
        </div>
      </div>

    </section>
  );
};

export default Home;
