import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(name, email, password);
      setSuccess("Registration successful! Please login.");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ================= LEFT ILLUSTRATION ================= */}
          <div className="hidden lg:flex justify-center">
            <img
              src="/image/superadmin-login-trim.jpg"
              alt="Signup Illustration"
              className="max-w-md w-full"
            />
          </div>

          {/* ================= SIGNUP FORM ================= */}
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg xl:max-w-xl"
            >
              <div className="border rounded-lg shadow-lg p-8">

                {/* LOGO */}
                <div className="flex justify-center mb-4">
                  <img
                    src="/image/navbar-logo.png"
                    alt="EduHub Logo"
                    className="h-10"
                  />
                </div>

                <h3 className="text-center text-2xl font-semibold mb-6">
                  Students | Signup
                </h3>

                {/* ERROR MESSAGE */}
                {error && (
                  <p className="text-red-500 text-sm text-center mb-4">
                    {error}
                  </p>
                )}

                {/* SUCCESS MESSAGE */}
                {success && (
                  <p className="text-green-500 text-sm text-center mb-4">
                    {success}
                  </p>
                )}

                {/* NAME */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* EMAIL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* SHOW PASSWORD */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="text-sm text-gray-700">
                    Show Password
                  </span>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-500 text-white py-3 rounded font-semibold hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* LOGIN LINK */}
                <p className="text-sm text-center mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:underline"
                  >
                    Log in
                  </Link>
                </p>

              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Register;
