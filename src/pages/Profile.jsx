import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user: authUser, getUserRole, login } = useAuth();
  const [user, setUser] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessFading, setIsSuccessFading] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const userRole = getUserRole();

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

  // Auto-hide error message after 6 seconds with fade effect
  useEffect(() => {
    if (submitStatus === 'error') {
      // Start fade-out after 5 seconds
      const fadeTimer = setTimeout(() => {
        setIsErrorFading(true);
      }, 5000);

      // Remove message completely after 6 seconds
      const removeTimer = setTimeout(() => {
        setSubmitStatus(null);
        setIsErrorFading(false);
        setErrorMessage("");
      }, 6000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [submitStatus]);

  if (loading) {
    return (
      <section className="container mx-auto pt-24 px-6">
        <div className="text-center">Loading profile...</div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSubmitStatus(null);
    setErrorMessage("");

    // Frontend validation based on backend constraints
    if (user.name.trim().length < 3) {
      setErrorMessage("Name must be at least 3 characters long");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (user.name.trim().length > 200) {
      setErrorMessage("Name cannot exceed 200 characters");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (user.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    try {
      // Prepare payload (email is not included since it's not editable)
      const payload = {
        name: user.name.trim(),
        password: user.password,
      };

      console.log("Updating profile:", payload);
      console.log("User ID:", user.id);
      console.log("User Role:", userRole);
      console.log("Auth Token:", localStorage.getItem("token") ? "Present" : "Missing");

      // Determine API endpoint based on user role
      const apiEndpoint = userRole === "admin" 
        ? "http://localhost:8080/api/admin/update"
        : "http://localhost:8080/api/user/update";

      console.log("Using API endpoint:", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        // Try to parse JSON response
        let result;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();
          if (text) {
            result = JSON.parse(text);
          } else {
            result = { message: "Profile updated successfully" };
          }
        } else {
          const text = await response.text();
          result = { message: text || "Profile updated successfully" };
        }
        
        console.log("Profile updated successfully:", result);
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
      } else {
        // Handle error responses
        let errorMessage;
        const contentType = response.headers.get("content-type");
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error;
            
            // Handle Spring Boot validation errors
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessage = errorData.errors.map(err => err.defaultMessage || err.message).join(', ');
            } else if (errorData.fieldErrors) {
              errorMessage = Object.values(errorData.fieldErrors).flat().join(', ');
            }
          } else {
            const errorText = await response.text();
            errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorMessage = null;
        }
        
        // Provide user-friendly error messages based on status code
        let userFriendlyMessage;
        switch (response.status) {
          case 400:
            userFriendlyMessage = errorMessage || "Invalid profile data. Please check all fields and try again.";
            break;
          case 401:
            userFriendlyMessage = errorMessage || "Authentication required. Please log in again.";
            break;
          case 403:
            userFriendlyMessage = errorMessage || "Access denied. You can only update your own profile.";
            break;
          case 404:
            userFriendlyMessage = errorMessage || "User not found. Please refresh the page and try again.";
            break;
          case 409:
            userFriendlyMessage = errorMessage || "Email already exists. Please use a different email address.";
            break;
          case 422:
            userFriendlyMessage = errorMessage || "Invalid data format. Please check your input and try again.";
            break;
          case 500:
            userFriendlyMessage = errorMessage || "Server error occurred. Please try again later.";
            break;
          default:
            userFriendlyMessage = errorMessage || `Failed to update profile. Please try again. (Error ${response.status})`;
        }
        
        console.error("Profile update failed:", userFriendlyMessage);
        setErrorMessage(userFriendlyMessage);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage("Cannot connect to server. Please check if the backend is running.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setSubmitStatus('error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="text-gray-600 body-font pt-2 pb-2">
      <div className="container px-5 py-12 mx-auto flex flex-wrap items-center">

        <h1 className="text-3xl font-medium text-gray-900 mb-6 w-full text-center">
          {userRole === "admin" ? "Admin Profile" : "My Profile"}
        </h1>

        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col mx-auto">

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className={`mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded transition-opacity duration-1000 ${
              isSuccessFading ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Profile updated successfully!</span>
              </div>
             
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className={`mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded transition-opacity duration-1000 ${
              isErrorFading ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage || "Failed to update profile. Please try again."}</span>
              </div>
              
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 className="text-gray-900 text-lg font-medium mb-5">
              Profile Details
            </h2>

            {/* Email */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full bg-gray-100 rounded border border-gray-300 py-2 px-3 text-gray-500 cursor-not-allowed"
                value={user.email}
                required
                disabled={true}
                placeholder="Enter your email address"
              />
            </div>

            {/* Name */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Name <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(3-200 characters)</span>
              </label>
              <input
                type="text"
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <div className="text-xs text-gray-500 mt-1">
                {user.name.length}/200 characters
              </div>
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <label className="leading-7 text-sm text-gray-600">
                Password <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(Minimum 6 characters)</span>
              </label>
              <input
                type="password"
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
                placeholder="Enter your password"
                disabled={updating}
                required
                minLength={6}
              />
              <div className="text-xs text-gray-500 mt-1">
                Password strength: {user.password.length >= 6 ? 'Good' : 'Too short (minimum 6 characters)'}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={updating}
                className={`px-8 py-2 rounded-full transition-colors duration-200 ${
                  updating 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
