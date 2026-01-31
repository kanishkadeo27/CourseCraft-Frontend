import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userService, adminService } from "../api";
import useApi from "../hooks/useApi";

const Profile = () => {
  const { user: authUser, getUserRole } = useAuth();
  const [user, setUser] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSuccessFading, setIsSuccessFading] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const userRole = getUserRole();

  // Use appropriate API service based on user role
  const apiService = userRole === "admin" ? adminService.updateProfile : userService.updateProfile;
  const { loading: updating, error, execute: updateProfile } = useApi(apiService);

  // Load user data from AuthContext
  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        password: "",
      });
    }
    setLoading(false);
  }, [authUser]);

  // Auto-hide success message after 5 seconds with fade effect
  useEffect(() => {
    if (submitStatus === 'success') {
      // Start fade-out after 4 seconds
      const fadeTimer = setTimeout(() => {
        setIsSuccessFading(true);
      }, 4000);

      // Remove message completely after 5 seconds
      const removeTimer = setTimeout(() => {
        setSubmitStatus(null);
        setIsSuccessFading(false);
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [submitStatus]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      setSubmitStatus('error');
    }
  }, [error]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    // Frontend validation based on backend constraints
    if (user.name.trim().length < 3) {
      setSubmitStatus('error');
      return;
    }

    if (user.name.trim().length > 200) {
      setSubmitStatus('error');
      return;
    }

    if (user.password.length < 6) {
      setSubmitStatus('error');
      return;
    }

    try {
      // Prepare payload (email is not included since it's not editable)
      const payload = {
        name: user.name.trim(),
        password: user.password,
      };

      await updateProfile(payload);
      
      setSubmitStatus('success');
      
      // Update the user state with new data (email remains unchanged)
      const updatedUserData = {
        ...authUser,
        name: user.name.trim()
      };
      
      // Clear password field after successful update
      setUser(prev => ({ ...prev, password: "" }));
      
      // Update localStorage user data
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      // Update the form state to reflect the new "original" values
      setUser(prev => ({
        ...prev,
        name: user.name.trim(),
        password: ""
      }));
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {userRole === "admin" ? "Admin Profile" : "My Profile"}
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Profile Details
              </h2>
              <p className="text-sm text-gray-600">
                Update your personal information below
              </p>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className={`mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl transition-opacity duration-1000 ${
                isSuccessFading ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Profile updated successfully!</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className={`mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl transition-opacity duration-1000 ${
                isErrorFading ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{error.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Email <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500">Your email address cannot be changed</p>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed transition-all duration-200"
                  value={user.email}
                  required
                  disabled={true}
                  placeholder="Email address"
                />
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                  required
                  disabled={updating}
                  minLength={3}
                  maxLength={200}
                  placeholder="Enter your full name"
                />
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">3–200 characters</p>
                  <p className="text-xs text-gray-400">{user.name.length}/200</p>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  disabled={updating}
                  required
                  minLength={6}
                />
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">Minimum 6 characters</p>
                  <p className="text-xs text-gray-400">
                    {user.password.length >= 6 ? 'Good' : 'Too short'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    updating 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Profile...
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
