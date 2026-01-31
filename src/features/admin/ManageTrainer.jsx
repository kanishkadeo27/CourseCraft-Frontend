import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../api";

const ManageTrainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [trainer, setTrainer] = useState({
    id: "",
    name: "",
    description: "",
    rating: "",
    imageUrl: "",
  });

  // Auto-fade messages after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Load trainer data based on ID using real API
  useEffect(() => {
    const loadTrainer = async () => {
      try {
        const trainerData = await adminService.getTrainerById(id);
        const trainerInfo = trainerData.data || trainerData;
        
        if (trainerInfo) {
          setTrainer({
            id: trainerInfo.id,
            name: trainerInfo.name,
            description: trainerInfo.description,
            rating: trainerInfo.rating.toString(),
            imageUrl: trainerInfo.imageUrl,
          });
        } else {
          setErrorMessage("Trainer not found");
          setSubmitStatus('error');
        }
      } catch (error) {
        setErrorMessage(error.message || "Failed to load trainer data");
        setSubmitStatus('error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTrainer();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrorMessage("");
    setUpdating(true);

    if (!trainer.name.trim()) {
      setErrorMessage("Trainer name is required");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (trainer.name.trim().length < 3) {
      setErrorMessage("Trainer name must be at least 3 characters long");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (trainer.name.trim().length > 200) {
      setErrorMessage("Trainer name cannot exceed 200 characters");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (!trainer.description.trim()) {
      setErrorMessage("Description is required");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (trainer.description.trim().length < 10) {
      setErrorMessage("Description must be at least 10 characters long");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (trainer.description.trim().length > 1000) {
      setErrorMessage("Description cannot exceed 1000 characters");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (!trainer.rating || trainer.rating === "") {
      setErrorMessage("Rating is required");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (isNaN(trainer.rating) || trainer.rating < 0.0 || trainer.rating > 5.0) {
      setErrorMessage("Rating must be a number between 0.0 and 5.0");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (!trainer.imageUrl.trim()) {
      setErrorMessage("Image URL is required");
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    try {
      const payload = {
        name: trainer.name.trim(),
        description: trainer.description.trim(),
        rating: parseFloat(trainer.rating),
        imageUrl: trainer.imageUrl.trim(),
      };

      await adminService.updateTrainer(trainer.id, payload);
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        navigate("/admin/trainers");
      }, 2000);
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err.message || "Failed to update trainer. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading trainer data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Trainer</h1>
          <p className="text-gray-600 mt-2">Update trainer information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          
          {/* Trainer Preview */}
          {(trainer.name || trainer.description || trainer.rating) && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainer Preview</h3>
              <div className="flex items-start space-x-4">
                {/* Trainer Image - Only show if URL is provided */}
                {trainer.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Trainer Info */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {trainer.name}
                  </h4>
                  
                  {/* Rating */}
                  {trainer.rating && (
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = parseFloat(trainer.rating);
                          const filled = rating >= star;
                          const partiallyFilled = rating > star - 1 && rating < star;
                          const fillPercentage = partiallyFilled ? ((rating - (star - 1)) * 100) : 0;
                          
                          return (
                            <div key={star} className="relative w-4 h-4">
                              {/* Background star (empty) */}
                              <svg
                                className="absolute inset-0 w-4 h-4 fill-gray-300"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              
                              {/* Filled star */}
                              {(filled || partiallyFilled) && (
                                <div 
                                  className="absolute inset-0 overflow-hidden"
                                  style={{ 
                                    width: filled ? '100%' : `${fillPercentage}%` 
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4 fill-yellow-400"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">{trainer.rating}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm">
                    {trainer.description}
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
                <span>Trainer updated successfully! Redirecting to trainers list...</span>
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
                <span>{errorMessage || "Failed to update trainer. Please try again."}</span>
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
                  value={trainer.name}
                  onChange={(e) => setTrainer({ ...trainer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter trainer's full name"
                  required
                  disabled={updating}
                  minLength={3}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={trainer.rating}
                  onChange={(e) => setTrainer({ ...trainer, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter rating (0.0-5.0)"
                  required
                  disabled={updating}
                />
              </div>

              {/* Trainer Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trainer Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={trainer.imageUrl}
                  onChange={(e) => setTrainer({ ...trainer, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/trainer-photo.jpg"
                  required
                  disabled={updating}
                />
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
                  disabled={updating}
                />
                
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/admin/trainers")}
                disabled={updating}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  updating 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {updating ? 'Updating...' : 'Update Trainer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageTrainer;