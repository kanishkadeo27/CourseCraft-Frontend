import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("Restored user from localStorage:", parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Real login function using backend API
  const login = async (email, password) => {
    try {
      console.log("Login attempt for:", email);
      
      // Use authService for API call
      const data = await authService.login({ email, password });
      console.log("Login response:", data);

      // Handle different possible response structures from backend
      const token = data.token || data.accessToken || data.jwt;
      const userData = data.user || data.data || {
        id: data.id || data.userId,
        name: data.name,
        email: data.email,
        role: data.role || "user"
      };

      if (!token) {
        throw new Error("No authentication token received");
      }

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      console.log("Login successful, user set:", userData);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      
      // Provide user-friendly error messages based on status code
      let userFriendlyMessage;
      if (error.status) {
        switch (error.status) {
          case 400:
            userFriendlyMessage = error.message || "Invalid email or password format. Please check your input.";
            break;
          case 401:
            userFriendlyMessage = error.message || "Invalid email or password. Please check your credentials and try again.";
            break;
          case 403:
            userFriendlyMessage = error.message || "Your account access is restricted. Please contact support if you believe this is an error.";
            break;
          case 404:
            userFriendlyMessage = error.message || "Account not found. Please check your email or sign up for a new account.";
            break;
          case 429:
            userFriendlyMessage = error.message || "Too many login attempts. Please wait a few minutes before trying again.";
            break;
          case 500:
            userFriendlyMessage = error.message || "Server error occurred. Please try again later or contact support.";
            break;
          case 503:
            userFriendlyMessage = error.message || "Service temporarily unavailable. Please try again in a few minutes.";
            break;
          default:
            userFriendlyMessage = error.message || `Login failed. Please try again or contact support. (Error ${error.status})`;
        }
      } else {
        userFriendlyMessage = error.message || "Cannot connect to server. Please check if the backend is running.";
      }
      
      throw new Error(userFriendlyMessage);
    }
  };

  // Real register function using backend API
  const register = async (name, email, password) => {
    try {
      console.log("Registration attempt for:", email);
      
      // Use authService for API call
      const data = await authService.register({ name, email, password });
      console.log("Registration response:", data);
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      
      // Provide user-friendly error messages based on status code
      let userFriendlyMessage;
      if (error.status) {
        switch (error.status) {
          case 400:
            userFriendlyMessage = error.message || "Invalid registration data. Please check all fields and try again.";
            break;
          case 409:
            userFriendlyMessage = error.message || "An account with this email already exists. Please use a different email or try logging in.";
            break;
          case 422:
            userFriendlyMessage = error.message || "Please check your input. Password must be at least 6 characters long.";
            break;
          case 429:
            userFriendlyMessage = error.message || "Too many registration attempts. Please wait a few minutes before trying again.";
            break;
          case 500:
            userFriendlyMessage = error.message || "Server error occurred during registration. Please try again later.";
            break;
          case 503:
            userFriendlyMessage = error.message || "Registration service temporarily unavailable. Please try again in a few minutes.";
            break;
          default:
            userFriendlyMessage = error.message || `Registration failed. Please try again or contact support. (Error ${error.status})`;
        }
      } else {
        userFriendlyMessage = error.message || "Cannot connect to server. Please check if the backend is running.";
      }
      
      throw new Error(userFriendlyMessage);
    }
  };

  // Logout function
  const logout = async () => {
    console.log("Logging out user...");
    
    // Clear local storage and user state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    console.log("Local storage cleared, user logged out");
  };

  // Helper function to normalize role (handles ROLE_USER/ROLE_ADMIN format)
  const normalizeRole = (role) => {
    if (!role) return null;
    const lowerRole = role.toLowerCase();
    if (lowerRole.startsWith('role_')) {
      return lowerRole.replace('role_', '');
    }
    return lowerRole;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user?.role) return false;
    return normalizeRole(user.role) === normalizeRole(role);
  };

  // Get normalized user role
  const getUserRole = () => {
    return normalizeRole(user?.role);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("token");
  };

  // Get authorization header for API calls
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    getUserRole,
    normalizeRole,
    isAuthenticated,
    getAuthHeader
  };

  console.log("AuthProvider rendering with value:", { 
    user: user ? `${user.name} (${user.role})` : null, 
    loading,
    isAuthenticated: isAuthenticated()
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};