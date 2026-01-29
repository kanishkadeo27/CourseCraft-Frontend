import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { contactService } from "../api";
import useApi from "../hooks/useApi";

const ContactUsWithApi = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Use the API hook for contact form submission
  const { loading, error, execute: submitContact } = useApi(contactService.submitContactForm);
  const [submitStatus, setSubmitStatus] = useState(null);
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

  // Handle API errors
  useEffect(() => {
    if (error) {
      setSubmitStatus('error');
    }
  }, [error]);

  // Auto-hide success message after 5 seconds with fade effect
  useEffect(() => {
    if (submitStatus === 'success') {
      const fadeTimer = setTimeout(() => {
        setIsSuccessFading(true);
      }, 4000);

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
    setSubmitStatus(null);

    // Frontend validation
    if (!form.name.trim()) {
      setSubmitStatus('error');
      return;
    }

    if (form.name.trim().length < 3 || form.name.trim().length > 100) {
      setSubmitStatus('error');
      return;
    }

    if (!form.email.trim()) {
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setSubmitStatus('error');
      return;
    }

    if (!form.message.trim()) {
      setSubmitStatus('error');
      return;
    }

    if (form.message.trim().length < 10 || form.message.trim().length > 2000) {
      setSubmitStatus('error');
      return;
    }

    try {
      // Use the API service instead of fetch
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      console.log("Contact form submitted successfully");
      setSubmitStatus('success');
      
      // Reset message field (keep name and email for user convenience)
      setForm(prev => ({
        ...prev,
        message: ""
      }));
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSubmitStatus('error');
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="text-gray-600 body-font pt-2 pb-2">
      <div className="container px-5 py-12 mx-auto flex flex-wrap items-center">
        <h1 className="text-3xl font-medium text-gray-900 mb-6 w-full text-center">
          Contact Us
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
                <span>Thank you for contacting us. We will get back to you soon.</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error?.message || "Failed to submit contact form. Please try again."}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 className="text-gray-900 text-lg font-medium mb-5">
              Get in Touch
            </h2>

            {/* Name */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
                minLength={3}
                maxLength={100}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
                placeholder="Enter your email address"
              />
            </div>

            {/* Message */}
            <div className="relative mb-6">
              <label className="leading-7 text-sm text-gray-600">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                required
                disabled={loading}
                minLength={10}
                maxLength={2000}
                placeholder="Enter your message (minimum 10 characters)"
              />
              <div className="text-xs text-gray-500 mt-1">
                {form.message.length}/2000 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-2 w-full">
              <button
                type="submit"
                disabled={loading}
                className={`flex mx-auto px-8 py-2 rounded-full transition-colors duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUsWithApi;