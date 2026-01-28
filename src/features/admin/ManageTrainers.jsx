import { useState, useEffect } from "react";

const ManageTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  // Mock trainers data (replace with real API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrainers([
        { 
          trainerId: 1, 
          trainerName: "John Smith", 
          description: "Expert Java developer with 10+ years of experience in enterprise applications.", 
          rating: 4.8, 
          imageUrl: "/image/teachers/author1.jpg"
        },
        { 
          trainerId: 2, 
          trainerName: "Sarah Johnson", 
          description: "Full-stack developer specializing in React and Node.js with passion for teaching.", 
          rating: 4.9, 
          imageUrl: "/image/teachers/author1.jpg"
        },
        { 
          trainerId: 3, 
          trainerName: "Mike Wilson", 
          description: "Senior software architect with expertise in microservices and cloud technologies.", 
          rating: 4.7, 
          imageUrl: "/image/teachers/author1.jpg"
        },
        { 
          trainerId: 4, 
          trainerName: "Emily Davis", 
          description: "Data science expert with PhD in Computer Science and 8 years industry experience.", 
          rating: 4.6, 
          imageUrl: "/image/teachers/author1.jpg"
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRating = ratingFilter === "";
    if (!matchesRating) {
      const trainerRating = Math.floor(trainer.rating);
      const filterRating = parseInt(ratingFilter);
      matchesRating = trainerRating === filterRating;
    }
    
    return matchesSearch && matchesRating;
  });

  const handleRatingChange = (trainerId, newRating) => {
    setTrainers(trainers.map(trainer =>
      trainer.trainerId === trainerId ? { ...trainer, rating: parseFloat(newRating) } : trainer
    ));
  };

  const handleDeleteTrainer = (trainerId) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      setTrainers(trainers.filter(trainer => trainer.trainerId !== trainerId));
    }
  };

  const handleManageTrainer = (trainerId) => {
    // Navigate to manage trainer page
    window.location.href = `/admin/manage/${trainerId}/trainer`;
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
                  <tr key={trainer.trainerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={trainer.imageUrl || "/image/teachers/author1.jpg"}
                            alt={trainer.trainerName}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "/image/teachers/author1.jpg";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{trainer.trainerName}</div>
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
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                trainer.rating >= star ? 'fill-current' : 'fill-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={trainer.rating}
                          onChange={(e) => handleRatingChange(trainer.trainerId, e.target.value)}
                          className="w-16 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleManageTrainer(trainer.trainerId)}
                        className="mr-3 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleDeleteTrainer(trainer.trainerId)}
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

      </div>
    </div>
  );
};

export default ManageTrainers;