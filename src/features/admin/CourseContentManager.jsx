import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { courseService } from "../../api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CourseContentManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCourseData = location.state?.courseData;
  const isNewCourse = location.state?.isNewCourse || false;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Display data for read-only course info
  const courseDisplayData = {
    name: passedCourseData?.title || "",
    description: passedCourseData?.description || ""
  };
  
  const [contentPairs, setContentPairs] = useState(Array(10).fill().map((_, index) => ({
    id: index + 1,
    lessonName: "",
    lessonNo: index + 1,
    materials: [
      {
        title: "",
        path: "",
        type: "VIDEO",
        sequenceNo: 1
      },
      {
        title: "",
        path: "",
        type: "PDF", 
        sequenceNo: 2
      }
    ]
  })));

  // Initialize loading state based on whether we have course data
  useEffect(() => {
    if (passedCourseData && isNewCourse) {
      setLoading(false);
    } else {
      // If no course data passed, this shouldn't happen in the new workflow
      setMessage({ type: 'error', text: 'No course data provided. Please start from Create Course page.' });
      setLoading(false);
    }
  }, [passedCourseData, isNewCourse]);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLessonNameChange = (index, value) => {
    const updatedContentPairs = [...contentPairs];
    updatedContentPairs[index].lessonName = value;
    setContentPairs(updatedContentPairs);
  };

  const handleMaterialChange = (lessonIndex, materialIndex, field, value) => {
    const updatedContentPairs = [...contentPairs];
    updatedContentPairs[lessonIndex].materials[materialIndex] = {
      ...updatedContentPairs[lessonIndex].materials[materialIndex],
      [field]: value
    };
    setContentPairs(updatedContentPairs);
  };

  const handleTestConnection = async () => {
    try {
      // Test a simple admin endpoint first
      const response = await fetch('http://localhost:8080/api/admin/courses', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'API connection test successful!' });
      } else {
        const errorText = await response.text();
        setMessage({ type: 'error', text: `API test failed: ${response.status} - ${errorText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Connection test failed: ${error.message}` });
    }
  };

  const handleSave = async () => {
    if (!passedCourseData || !isNewCourse) {
      setMessage({ type: 'error', text: 'Invalid course data. Please start from Create Course page.' });
      return;
    }

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    try {
      setSaving(true);
      
      // Validate required fields from passedCourseData
      const requiredFields = ['title', 'description', 'trainerId'];
      const missingFields = requiredFields.filter(field => !passedCourseData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Filter lessons that have at least a lesson name and one material
      const validLessons = contentPairs.filter(lesson => 
        lesson.lessonName.trim() && 
        lesson.materials.some(material => material.title.trim() && material.path.trim())
      );

      // Prepare lessons data in the expected API format
      const lessons = validLessons.map(lesson => ({
        lessonName: lesson.lessonName.trim(),
        lessonNo: lesson.lessonNo,
        materials: lesson.materials
          .filter(material => material.title.trim() && material.path.trim())
          .map(material => ({
            title: material.title.trim(),
            path: material.path.trim(),
            type: material.type,
            sequenceNo: material.sequenceNo
          }))
      }));

      // Prepare complete course data for API
      const completePayload = {
        ...passedCourseData,
        syllabus: {
          lessons: lessons
        }
      };
      
      await courseService.createCourse(completePayload);
      
      setMessage({ type: 'success', text: 'Course created successfully! Redirecting to dashboard...' });
      
      // Navigate to dashboard after showing success message
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Failed to create course';
      
      if (error.status === 403) {
        errorMessage = 'Access denied (403). Possible causes:\n' +
                     '• Insufficient permissions (not admin role)\n' +
                     '• Token expired or invalid\n' +
                     '• API endpoint requires different authentication\n' +
                     '• Server-side authorization rules\n\n' +
                     'Please check browser console for detailed logs and try logging out/in again.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed (401). Please log in again.';
      } else if (error.status === 400) {
        errorMessage = `Bad request (400): ${error.data?.message || error.message || 'Invalid data sent to server'}`;
      } else if (error.status === 500) {
        errorMessage = 'Server error (500). Please try again later or contact support.';
      } else if (error.message) {
        errorMessage = `Failed to create course: ${error.message}`;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading course content..." size="lg" />;
  }

  return (
    <div className="container mx-auto px-6 py-8 relative">
      {saving && <LoadingSpinner overlay={true} text="Creating course..." size="lg" />}
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Course Content</h1>
              <p className="text-gray-600 mt-2">Add videos and PDFs to complete your course creation</p>
            </div>
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              ← Back to Create Course
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

        {/* New Course Info Display */}
        {passedCourseData && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Course Details</h2>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-medium text-gray-900 mb-2">{passedCourseData.title}</p>
              <p className="text-sm text-gray-600 mb-3">{passedCourseData.description}</p>
              <div className="flex flex-wrap gap-2">
                {passedCourseData.topics && passedCourseData.topics.map((topic, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {passedCourseData.level}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {passedCourseData.mode}
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  ₹{passedCourseData.price}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Course Basic Info - Read Only */}
        {passedCourseData && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {courseDisplayData.name}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 min-h-[80px]">
                  {courseDisplayData.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Pairs Section */}
        {passedCourseData && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Lessons (Up to 10 Lessons)</h2>
            <div className="space-y-8">
              {contentPairs.map((lesson, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Lesson {index + 1}</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Name *
                      </label>
                      <input
                        type="text"
                        value={lesson.lessonName}
                        onChange={(e) => handleLessonNameChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter lesson name"
                      />
                    </div>
                  </div>
                  
                  {/* Video Section */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-blue-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Video Material
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video Title
                        </label>
                        <input
                          type="text"
                          value={lesson.materials[0]?.title || ''}
                          onChange={(e) => handleMaterialChange(index, 0, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter video title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video URL
                        </label>
                        <input
                          type="url"
                          value={lesson.materials[0]?.path || ''}
                          onChange={(e) => handleMaterialChange(index, 0, 'path', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* PDF Section */}
                  <div>
                    <h4 className="text-md font-medium text-red-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      PDF Material
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PDF Title
                        </label>
                        <input
                          type="text"
                          value={lesson.materials[1]?.title || ''}
                          onChange={(e) => handleMaterialChange(index, 1, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter PDF title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PDF URL
                        </label>
                        <input
                          type="url"
                          value={lesson.materials[1]?.path || ''}
                          onChange={(e) => handleMaterialChange(index, 1, 'path', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/document.pdf"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {passedCourseData && (
          <div className="flex justify-between items-center">
            <button
              onClick={handleTestConnection}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
            >
              Test API Connection
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/admin/courses/create')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-2 rounded-lg transition ${
                  saving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {saving ? 'Creating Course...' : 'Add Course'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseContentManager;