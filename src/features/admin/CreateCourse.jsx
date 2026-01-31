import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainersLoading, setTrainersLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  
  const [course, setCourse] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    price: "",
    level: "BEGINNER",
    mode: "ONLINE",
    language: "English",
    isPublished: true,
    trainerId: "",
    topics: []
  });

  const [topicsInput, setTopicsInput] = useState("");

  // Load trainers from API
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        setTrainersLoading(true);
        const response = await adminService.getAllTrainers();
        setTrainers(response.data || []);
      } catch (err) {
        setSubmitStatus('error');
        setTrainers([]);
      } finally {
        setTrainersLoading(false);
      }
    };
    loadTrainers();
  }, []);

  // Auto-fade messages after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleTopicsChange = (e) => {
    setTopicsInput(e.target.value);
    // Convert comma-separated string to array
    const topicsArray = e.target.value
      .split(',')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0);
    
    setCourse({
      ...course,
      topics: topicsArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setLoading(true);

    // Frontend validation
    if (!course.title.trim()) {
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (!course.description.trim()) {
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (!course.trainerId) {
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    if (course.topics.length === 0) {
      setSubmitStatus('error');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: course.title.trim(),
        description: course.description.trim(),
        thumbnailUrl: course.thumbnailUrl.trim() || null,
        price: course.price ? parseFloat(course.price) : 0,
        level: course.level,
        mode: course.mode,
        language: course.language,
        isPublished: course.isPublished,
        trainerId: parseInt(course.trainerId),
        topics: course.topics
      };

      setLoading(false);
      
      // Navigate to course content manager with course data
      navigate("/admin/courses/content", { 
        state: { 
          courseData: payload,
          isNewCourse: true 
        } 
      });
      
    } catch (err) {
      setSubmitStatus('error');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Fill in the course details, then add content in the next step</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          
          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded transition-opacity duration-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Course created successfully! Redirecting to all courses...</span>
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
                <span>Failed to create course. Please try again.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Course Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter course title"
                  required
                  disabled={loading}
                />
              </div>

              {/* Course Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the course content and objectives..."
                  required
                  disabled={loading}
                />
              </div>

              {/* Thumbnail URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={course.thumbnailUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/course-thumbnail.jpg"
                  disabled={loading}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={course.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0 for free course"
                  required
                  disabled={loading}
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={course.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={loading}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="mode"
                  value={course.mode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={loading}
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  name="language"
                  value={course.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={loading}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              {/* Topics */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Topics <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={handleTopicsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter topics separated by commas (e.g., JavaScript, React, Node.js)"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple topics with commas
                </p>
                {course.topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Trainer Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Trainer <span className="text-red-500">*</span>
                </label>
                {trainersLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 flex items-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                    Loading trainers...
                  </div>
                ) : (
                  <select
                    name="trainerId"
                    value={course.trainerId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Choose a trainer...</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.name} • {trainer.description.length > 50 
                          ? trainer.description.substring(0, 50) + '...' 
                          : trainer.description}
                      </option>
                    ))}
                  </select>
                )}
                {trainers.length === 0 && !trainersLoading && (
                  <p className="text-xs text-red-500 mt-1">
                    No trainers available. Please create trainers first.
                  </p>
                )}
              </div>

              {/* Published Status */}
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={course.isPublished}
                    onChange={(e) => setCourse({...course, isPublished: e.target.checked})}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publish course immediately
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Uncheck to save as draft
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
                {loading ? 'Processing...' : 'Add Course Content'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
