import { createContext, useContext, useState, useEffect } from "react";

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
      
      // Make API call to backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Try to parse error response - read the body only once
        let errorMessage;
        const contentType = response.headers.get("content-type");
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error;
          } else {
            const errorText = await response.text();
            errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          errorMessage = null;
        }
        
        // Provide user-friendly error messages based on status code
        let userFriendlyMessage;
        switch (response.status) {
          case 400:
            userFriendlyMessage = errorMessage || "Invalid email or password format. Please check your input.";
            break;
          case 401:
            userFriendlyMessage = errorMessage || "Invalid email or password. Please check your credentials and try again.";
            break;
          case 403:
            userFriendlyMessage = errorMessage || "Your account access is restricted. Please contact support if you believe this is an error.";
            break;
          case 404:
            userFriendlyMessage = errorMessage || "Account not found. Please check your email or sign up for a new account.";
            break;
          case 429:
            userFriendlyMessage = errorMessage || "Too many login attempts. Please wait a few minutes before trying again.";
            break;
          case 500:
            userFriendlyMessage = errorMessage || "Server error occurred. Please try again later or contact support.";
            break;
          case 503:
            userFriendlyMessage = errorMessage || "Service temporarily unavailable. Please try again in a few minutes.";
            break;
          default:
            userFriendlyMessage = errorMessage || `Login failed. Please try again or contact support. (Error ${response.status})`;
        }
        
        throw new Error(userFriendlyMessage);
      }

      // Handle both JSON and text responses
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Backend returned plain text - this shouldn't happen for login
        const textResponse = await response.text();
        throw new Error("Invalid response format from server");
      }

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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Cannot connect to server. Please check if the backend is running.");
      }
      throw new Error(error.message || "Login failed");
    }
  };

  // Real register function using backend API
  const register = async (name, email, password) => {
    try {
      console.log("Registration attempt for:", email);
      
      const userData = { name, email, password };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Try to parse error response - read the body only once
        let errorMessage;
        const contentType = response.headers.get("content-type");
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error;
          } else {
            const errorText = await response.text();
            errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          errorMessage = null;
        }
        
        // Provide user-friendly error messages based on status code
        let userFriendlyMessage;
        switch (response.status) {
          case 400:
            userFriendlyMessage = errorMessage || "Invalid registration data. Please check all fields and try again.";
            break;
          case 409:
            userFriendlyMessage = errorMessage || "An account with this email already exists. Please use a different email or try logging in.";
            break;
          case 422:
            userFriendlyMessage = errorMessage || "Please check your input. Password must be at least 6 characters long.";
            break;
          case 429:
            userFriendlyMessage = errorMessage || "Too many registration attempts. Please wait a few minutes before trying again.";
            break;
          case 500:
            userFriendlyMessage = errorMessage || "Server error occurred during registration. Please try again later.";
            break;
          case 503:
            userFriendlyMessage = errorMessage || "Registration service temporarily unavailable. Please try again in a few minutes.";
            break;
          default:
            userFriendlyMessage = errorMessage || `Registration failed. Please try again or contact support. (Error ${response.status})`;
        }
        
        throw new Error(userFriendlyMessage);
      }

      // Handle both JSON and text responses
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Backend returned plain text
        const textResponse = await response.text();
        data = { message: textResponse };
      }
      
      console.log("Registration response:", data);
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Cannot connect to server. Please check if the backend is running.");
      }
      throw new Error(error.message || "Registration failed");
    }
  };

  // Logout function
  const logout = async () => {
    console.log("Logging out user...");
    
    try {
      // Optional: Call backend logout if you have the endpoint
      // const token = localStorage.getItem("token");
      // if (token) {
      //   await fetch("/api/auth/logout", {
      //     method: "POST",
      //     headers: { "Authorization": `Bearer ${token}` }
      //   });
      // }
    } catch (error) {
      console.warn("Backend logout failed:", error.message);
    } finally {
      // Always clear local storage and user state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("Local storage cleared, user logged out");
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