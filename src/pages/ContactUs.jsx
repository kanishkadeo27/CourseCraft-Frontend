import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ContactUs = () => {
  const { user } = useAuth();
  console.log(user);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessFading, setIsSuccessFading] = useState(false);

  // Load user data from AuthContext
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrorMessage("");

    if (!form.message.trim()) {
      setErrorMessage("Message is required");
      setLoading(false);
      return;
    }

    if (form.name.trim().length < 3) {
      setErrorMessage("Name must be at least 3 characters long");
      setLoading(false);
      return;
    }

    if (form.name.trim().length > 100) {
      setErrorMessage("Name cannot exceed 100 characters");
      setLoading(false);
      return;
    }

    if (form.message.trim().length < 10) {
      setErrorMessage("Message must be at least 10 characters long");
      setLoading(false);
      return;
    }

    if (form.message.trim().length > 2000) {
      setErrorMessage("Message cannot exceed 2000 characters");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        message: form.message
      };

      const response = await fetch("http://localhost:8080/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Try to parse JSON response, but handle cases where response might be empty
        let result;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();
          if (text) {
            result = JSON.parse(text);
          } else {
            result = { message: "Contact form submitted successfully" };
          }
        } else {
          // If not JSON, treat as text
          const text = await response.text();
          result = { message: text || "Contact form submitted successfully" };
        }
        
        setSubmitStatus('success');
        
        // Clear message after successful submit (keep name/email for logged-in users)
        setForm((prev) => ({ ...prev, message: "" }));
        
        // If guest user, clear all fields after successful submit
        if (!user) {
          setForm({ name: "", email: "", message: "" });
        }
      } else {
        // Handle error responses
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
          console.error("Error parsing error response:", parseError);
          errorMessage = null;
        }
        
        // Provide user-friendly error messages based on status code
        let userFriendlyMessage;
        switch (response.status) {
          case 400:
            // Validation errors - try to extract specific field errors
            if (errorMessage && typeof errorMessage === 'object') {
              // Handle Spring Boot validation error format
              const fieldErrors = errorMessage.errors || errorMessage.fieldErrors;
              if (fieldErrors && Array.isArray(fieldErrors)) {
                userFriendlyMessage = fieldErrors.map(err => err.defaultMessage || err.message).join(', ');
              } else {
                userFriendlyMessage = errorMessage.message || "Invalid form data. Please check all fields and try again.";
              }
            } else {
              userFriendlyMessage = errorMessage || "Invalid form data. Please check all fields and try again.";
            }
            break;
          case 401:
            userFriendlyMessage = errorMessage || "Authentication required. Please log in and try again.";
            break;
          case 403:
            userFriendlyMessage = errorMessage || "Access denied. The contact form service may be temporarily unavailable.";
            break;
          case 429:
            userFriendlyMessage = errorMessage || "Too many requests. Please wait a few minutes before trying again.";
            break;
          case 500:
            userFriendlyMessage = errorMessage || "Server error occurred. Please try again later or contact support directly.";
            break;
          default:
            userFriendlyMessage = errorMessage || `Failed to submit contact form. Please try again. (Error ${response.status})`;
        }
        
        setErrorMessage(userFriendlyMessage);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage("Cannot connect to server. Please check if the backend is running.");
        setSubmitStatus('error');
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setSubmitStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-start pt-2 px-4 pb-2">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-normal text-gray-900 mb-10">
        Contact Us
      </h1>

      {/* FORM CARD */}
      <div
        className="w-full max-w-lg rounded-xl p-8"
        style={{ backgroundColor: "#f5f6f8" }}
      >
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className={`mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded transition-opacity duration-1000 ${
            isSuccessFading ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Thank you for your message! We'll get back to you soon.</span>
            </div>
  
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage || "Sorry, there was an error sending your message. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(3-100 characters)</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white rounded py-3 px-4 text-gray-700 focus:outline-none shadow-sm"
              required
              disabled={loading}
              minLength={3}
              maxLength={100}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white rounded py-3 px-4 text-gray-700 focus:outline-none shadow-sm"
              required
              disabled={loading}
            />
          </div>

          {/* MESSAGE */}
          <div className="mb-10">
            <label className="block text-sm text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(10-2000 characters)</span>
            </label>
            <textarea
              placeholder="Enter your message here (minimum 10 characters)"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full bg-white rounded py-3 px-4 text-gray-700 h-32 resize-none focus:outline-none shadow-sm"
              required
              disabled={loading}
              minLength={10}
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {form.message.length}/2000 characters {form.message.length < 10 && `(${10 - form.message.length} more needed)`}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-3 rounded-full text-lg transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white`}
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default ContactUs;
