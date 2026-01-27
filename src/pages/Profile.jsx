import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  // Load user data from AuthContext
  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id || "",
        email: authUser.email || "",
        name: authUser.name || "",
        password: "",
      });
    }
    setLoading(false);
  }, [authUser]);

  if (loading) {
    return (
      <section className="container mx-auto pt-24 px-6">
        <div className="text-center">Loading profile...</div>
      </section>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: replace with API call
    console.log("Updated profile:", user);
  };

  const handleReset = () => {
    setUser({
      ...user,
      password: "",
    });
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">

        <h1 className="text-3xl font-medium text-gray-900 mb-6 w-full text-center">
          My Profile
        </h1>

        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col mx-auto">

          <form onSubmit={handleSubmit}>
            <h2 className="text-gray-900 text-lg font-medium mb-5">
              Profile Details
            </h2>

            {/* Email */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700"
                value={user.email}
                disabled
              />
            </div>

            {/* Name */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                type="text"
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700"
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <label className="leading-7 text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
                placeholder="Enter new password"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Delete Profile */}
          <div className="text-right mt-6">
            {user.id > 4 ? (
              <button className="text-red-600 hover:underline">
                Delete Profile
              </button>
            ) : (
              <span className="text-red-400">
                Delete Profile (disabled for this user)
              </span>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;
