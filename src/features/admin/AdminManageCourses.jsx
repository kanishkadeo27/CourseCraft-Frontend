import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchService, courseService } from "../../api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [message, setMessage] = useState(null);

  // Load courses with performance optimization
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await searchService.getAllCourses();
        setCourses(response.data || []);
      } catch (err) {
        setError('Failed to load courses. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      
      await courseService.deleteCourse(courseId);
      
      // Remove course from local state
      setCourses(courses.filter(course => course.id !== courseId));
      setMessage({ type: 'success', text: `Course "${courseTitle}" deleted successfully.` });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: `Failed to delete course "${courseTitle}". ${err.message || 'Please try again.'}` 
      });
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleManageCourse = (courseId) => {
    navigate(`/admin/courses/manage/${courseId}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading courses..." size="lg" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Error Loading Courses</h3>
                <p className="mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
              <p className="text-gray-600 mt-2">View, edit, and delete courses</p>
            </div>
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Course
            </button>
          </div>
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

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No courses found</div>
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Course Image */}
                <div className="h-48 bg-gray-200 relative">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.syllabus ? course.syllabus.lessons.length : 0} lessons
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        {course.level}
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      ₹{course.price}
                    </span>
                  </div>

                  {/* Topics */}
                  {course.topics && course.topics.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {course.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleManageCourse(course.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Manage Course
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      disabled={deletingCourseId === course.id}
                      className={`flex-1 px-4 py-2 text-sm rounded-lg transition ${
                        deletingCourseId === course.id
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {deletingCourseId === course.id ? 'Deleting...' : 'Delete Course'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageCourses;