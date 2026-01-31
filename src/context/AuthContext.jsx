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

  // Token expiration check utility
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Load user from localStorage on app start with token validation
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        // Check if token is expired
        if (isTokenExpired(token)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Periodic token expiration check
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        // Session expired - redirect to login
        window.location.href = '/login';
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Real login function using backend API
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });

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
      
      // Clear course progress if user is not a regular user (admin/guest)
      const userRole = userData.role?.toLowerCase();
      if (userRole !== 'user' && !userRole?.includes('user')) {
        localStorage.removeItem("courseProgress");
      }
      
      setUser(userData);
      return data;
    } catch (error) {
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
      const data = await authService.register({ name, email, password });
      return data;
    } catch (error) {
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

  // Logout function - properly clears all auth data and triggers re-render
  const logout = async () => {
    try {
      // Call backend logout endpoint if available
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await authService.logout();
        }
      } catch (error) {
        console.warn("Backend logout failed:", error.message);
        // Continue with local logout even if backend fails
      }
    } finally {
      // Always clear all local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("courseProgress");
      
      // Set user to null to trigger re-render and navbar switch
      setUser(null);
    }
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};