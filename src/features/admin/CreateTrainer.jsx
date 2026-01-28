import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateTrainer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [trainer, setTrainer] = useState({
    trainerName: "",
    description: "",
    rating: "",
    imageUrl: "",
  });

  // Auto-fade messages after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrorMessage("");

    // Frontend validation based on backend Trainer entity constraints
    if (!trainer.trainerName.trim()) {
      setErrorMessage("Trainer name is required");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (trainer.trainerName.trim().length < 3) {
      setErrorMessage("Trainer name must be at least 3 characters long");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (trainer.trainerName.trim().length > 200) {
      setErrorMessage("Trainer name cannot exceed 200 characters");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (!trainer.description.trim()) {
      setErrorMessage("Description is required");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (trainer.description.trim().length < 10) {
      setErrorMessage("Description must be at least 10 characters long");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (trainer.description.trim().length > 1000) {
      setErrorMessage("Description cannot exceed 1000 characters");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (trainer.rating && (isNaN(trainer.rating) || trainer.rating < 0.0 || trainer.rating > 5.0)) {
      setErrorMessage("Rating must be a number between 0.0 and 5.0");
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        trainerName: trainer.trainerName.trim(),
        description: trainer.description.trim(),
        rating: trainer.rating ? parseFloat(trainer.rating) : 0.0,
        imageUrl: trainer.imageUrl.trim() || null,
      };

      const response = await fetch("http://localhost:8080/api/admin/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Trainer created successfully");
        setSubmitStatus('success');
        
        // Reset form after successful creation
        setTrainer({
          trainerName: "",
          description: "",
          rating: "",
          imageUrl: "",
        });

        // Redirect to manage trainers page after 2 seconds
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
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
        
        // Provide user-friendly error messages
        let userFriendlyMessage;
        switch (response.status) {
          case 400:
            userFriendlyMessage = errorMessage || "Invalid trainer data. Please check all fields and try again.";
            break;
          case 401:
            userFriendlyMessage = errorMessage || "Authentication required. Please log in again.";
            break;
          case 403:
            userFriendlyMessage = errorMessage || "Access denied. You don't have permission to create trainers.";
            break;
          case 409:
            userFriendlyMessage = errorMessage || "A trainer with this name already exists.";
            break;
          case 500:
            userFriendlyMessage = errorMessage || "Server error occurred. Please try again later.";
            break;
          default:
            userFriendlyMessage = errorMessage || `Failed to create trainer. Please try again. (Error ${response.status})`;
        }
        
        console.error("Trainer creation failed:", userFriendlyMessage);
        setErrorMessage(userFriendlyMessage);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Error creating trainer:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage("Cannot connect to server. Please check if the backend is running.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Trainer</h1>
          <p className="text-gray-600 mt-2">Create a new trainer account</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          
          {/* Trainer Preview */}
          {(trainer.trainerName || trainer.description || trainer.imageUrl || trainer.rating) && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainer Preview</h3>
              <div className="flex items-start space-x-4">
                {/* Trainer Image */}
                <div className="flex-shrink-0">
                  <img
                    src={trainer.imageUrl || "/image/teachers/author1.jpg"}
                    alt={trainer.trainerName || "Trainer"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = "/image/teachers/author1.jpg";
                    }}
                  />
                </div>
                
                {/* Trainer Info */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {trainer.trainerName || "Trainer Name"}
                  </h4>
                  
                  {/* Rating */}
                  {trainer.rating && (
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              parseFloat(trainer.rating) >= star ? 'fill-current' : 'fill-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">{trainer.rating}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm">
                    {trainer.description || "Trainer description will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded transition-opacity duration-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Trainer created successfully! Redirecting to dashboard...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded transition-opacity duration-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage || "Failed to create trainer. Please try again."}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Trainer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trainer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={trainer.trainerName}
                  onChange={(e) => setTrainer({ ...trainer, trainerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter trainer's full name"
                  required
                  disabled={loading}
                  minLength={3}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-gray-500">(0.0-5.0)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={trainer.rating}
                  onChange={(e) => setTrainer({ ...trainer, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 4.5"
                  disabled={loading}
                />
              </div>

              {/* Trainer Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trainer Image URL
                </label>
                <input
                  type="url"
                  value={trainer.imageUrl}
                  onChange={(e) => setTrainer({ ...trainer, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/trainer-photo.jpg"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a URL to the trainer's profile image. Leave empty to use default image.
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trainer Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={trainer.description}
                  onChange={(e) => setTrainer({ ...trainer, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the trainer's background, expertise, and teaching experience..."
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed on the trainer's profile and course pages.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {loading ? 'Creating...' : 'Create Trainer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrainer;