import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../api";
import ConfirmModal from "../../components/common/ConfirmModal";

const ManageTrainers = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    trainerId: null,
    trainerName: ""
  });

  // Load trainers from API
  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const trainersData = await adminService.getAllTrainers();
      const trainersList = trainersData.data || trainersData.trainers || trainersData;
      setTrainers(Array.isArray(trainersList) ? trainersList : []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load trainers' });
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRating = ratingFilter === "";
    if (!matchesRating && trainer.rating !== null && trainer.rating !== undefined) {
      const trainerRating = Math.floor(parseFloat(trainer.rating));
      const filterRating = parseInt(ratingFilter);
      matchesRating = trainerRating === filterRating;
    }
    
    return matchesSearch && matchesRating;
  });

  const handleDeleteTrainer = async (trainerId) => {
    try {
      await adminService.deleteTrainer(trainerId);
      
      setMessage({ type: 'success', text: 'Trainer deleted successfully!' });
      
      setConfirmModal({ isOpen: false, trainerId: null, trainerName: "" });
      
      await loadTrainers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete trainer. Please try again.' });
      setConfirmModal({ isOpen: false, trainerId: null, trainerName: "" });
    }
  };

  const openDeleteModal = (trainer) => {
    setConfirmModal({
      isOpen: true,
      trainerId: trainer.id,
      trainerName: trainer.name
    });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ isOpen: false, trainerId: null, trainerName: "" });
  };

  const handleManageTrainer = (trainerId) => {
    // Navigate to manage trainer page
    navigate(`/admin/manage/${trainerId}/trainer`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading trainers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Trainers</h1>
          <p className="text-gray-600 mt-2">View and manage all platform trainers</p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                {message.type === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search trainers by name or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <a
                href="/admin/trainer/create"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
              >
                Add Trainer
              </a>
            </div>
          </div>
        </div>

        {/* Trainers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={trainer.imageUrl}
                            alt={trainer.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {trainer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {trainer.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
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
                        <span className="text-gray-600 text-sm">{trainer.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleManageTrainer(trainer.id)}
                        className="mr-3 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => openDeleteModal(trainer)}
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTrainers.length}</span> of{' '}
                <span className="font-medium">{trainers.length}</span> results
              </p>
            </div>
          </div>
        </div>

        {/* Custom Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteTrainer(confirmModal.trainerId)}
          title="Delete Trainer"
          message={`Are you sure you want to delete "${confirmModal.trainerName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

      </div>
    </div>
  );
};

export default ManageTrainers;