import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService, adminService } from "../../api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trainersLoading, setTrainersLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [currentTrainer, setCurrentTrainer] = useState(null);

  // Form state
  const [courseData, setCourseData] = useState({
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

  // Load trainers from API with performance tracking
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        setTrainersLoading(true);
        const response = await adminService.getAllTrainers();
        setTrainers(response.data || []);
      } catch (err) {
        setMessage({ type: 'error', text: `Failed to load trainers: ${err.message}` });
        setTrainers([]);
      } finally {
        setTrainersLoading(false);
      }
    };
    loadTrainers();
  }, []);

  // Load course data with performance tracking
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        
        // Use public endpoint to get course details
        const response = await courseService.getCourseById(id);
        const course = response.data;

        // Map API response to form state
        setCourseData({
          title: course.title || "",
          description: course.description || "",
          thumbnailUrl: course.thumbnailUrl || "",
          price: course.price || "",
          level: course.level || "BEGINNER",
          mode: course.mode || "ONLINE", 
          language: course.language || "English",
          isPublished: course.isPublished !== undefined ? course.isPublished : true,
          trainerId: course.trainerId || "",
          topics: course.topics || []
        });

        // Set topics input
        setTopicsInput(course.topics ? course.topics.join(", ") : "");

        // Find and set current trainer
        if (course.trainerId && trainers.length > 0) {
          const trainer = trainers.find(t => t.id === course.trainerId);
          setCurrentTrainer(trainer || null);
        }

        // Map syllabus to content pairs
        if (course.syllabus && course.syllabus.lessons) {
          const updatedContentPairs = Array(10).fill().map((_, index) => ({
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
          }));

          // Fill with existing lesson data
          course.syllabus.lessons.forEach((lesson, index) => {
            if (index < 10) {
              updatedContentPairs[index].lessonName = lesson.lessonName || "";
              updatedContentPairs[index].lessonNo = lesson.lessonNo || index + 1;
              
              // Map materials
              if (lesson.materials) {
                lesson.materials.forEach((material) => {
                  if (material.type === "VIDEO") {
                    updatedContentPairs[index].materials[0] = material;
                  } else if (material.type === "PDF") {
                    updatedContentPairs[index].materials[1] = material;
                  }
                });
              }
            }
          });

          setContentPairs(updatedContentPairs);
        }

      } catch (error) {
        setMessage({ type: 'error', text: `Failed to load course: ${error.message}` });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id]);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Set current trainer when both course data and trainers are loaded
  useEffect(() => {
    if (courseData.trainerId && trainers.length > 0 && !currentTrainer) {
      const trainer = trainers.find(t => t.id == courseData.trainerId);
      setCurrentTrainer(trainer || null);
    }
  }, [courseData.trainerId, trainers, currentTrainer]);

  const handleCourseDataChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTopicsChange = (e) => {
    setTopicsInput(e.target.value);
    // Convert comma-separated string to array
    const topicsArray = e.target.value
      .split(',')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0);
    
    setCourseData(prev => ({
      ...prev,
      topics: topicsArray
    }));
  };

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

  const handleSave = async () => {
    try {
      setSaving(true);
      
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
        title: courseData.title.trim(),
        description: courseData.description.trim(),
        thumbnailUrl: courseData.thumbnailUrl.trim() || null,
        price: courseData.price ? parseFloat(courseData.price) : 0,
        level: courseData.level,
        mode: courseData.mode,
        language: courseData.language,
        isPublished: courseData.isPublished,
        trainerId: parseInt(courseData.trainerId),
        topics: courseData.topics,
        syllabus: {
          lessons: lessons
        }
      };
      
      // Update course with content
      await courseService.updateCourse(id, completePayload);
      
      setMessage({ type: 'success', text: 'Course updated successfully! Redirecting to manage courses...' });
      
      // Navigate to manage courses page after showing success message
      setTimeout(() => {
        navigate('/admin/manage-courses');
      }, 2000);
      
    } catch (error) {
      const errorMessage = `Failed to update course: ${error.response?.data?.message || error.message}`;
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading course data..." size="lg" />;
  }

  return (
    <div className="container mx-auto px-6 py-8 relative">
      {saving && <LoadingSpinner overlay={true} text="Updating course..." size="lg" />}
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Course</h1>
              <p className="text-gray-600 mt-2">Update course information and content</p>
            </div>
            <button
              onClick={() => navigate('/admin/manage-courses')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              ← Back to Manage Courses
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

        {/* Course Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Course Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleCourseDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course title"
                disabled={saving}
              />
            </div>

            {/* Course Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) => handleCourseDataChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the course content and objectives..."
                disabled={saving}
              />
            </div>

            {/* Thumbnail URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={courseData.thumbnailUrl}
                onChange={(e) => handleCourseDataChange('thumbnailUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/course-thumbnail.jpg"
                disabled={saving}
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
                value={courseData.price}
                onChange={(e) => handleCourseDataChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0 for free course"
                disabled={saving}
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Level <span className="text-red-500">*</span>
              </label>
              <select
                value={courseData.level}
                onChange={(e) => handleCourseDataChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
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
                value={courseData.mode}
                onChange={(e) => handleCourseDataChange('mode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
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
                value={courseData.language}
                onChange={(e) => handleCourseDataChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topics separated by commas (e.g., JavaScript, React, Node.js)"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple topics with commas
              </p>
              {courseData.topics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {courseData.topics.map((topic, index) => (
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
              
              {/* Current Trainer Display */}
              {currentTrainer && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {currentTrainer.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-blue-900">
                        Current Trainer: {currentTrainer.name}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {currentTrainer.description}
                      </p>
                      {currentTrainer.email && (
                        <p className="text-xs text-blue-600 mt-1">
                          📧 {currentTrainer.email}
                        </p>
                      )}
                      {currentTrainer.expertise && currentTrainer.expertise.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-blue-600 mb-1">Expertise:</p>
                          <div className="flex flex-wrap gap-1">
                            {currentTrainer.expertise.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {currentTrainer.expertise.length > 3 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                +{currentTrainer.expertise.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Trainer Dropdown */}
              {trainersLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                  Loading trainers...
                </div>
              ) : (
                <select
                  value={courseData.trainerId}
                  onChange={(e) => {
                    handleCourseDataChange('trainerId', e.target.value);
                    // Update current trainer when selection changes
                    const trainer = trainers.find(t => t.id == e.target.value);
                    setCurrentTrainer(trainer || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
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
              
              {!currentTrainer && courseData.trainerId && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Current trainer not found in available trainers list
                </p>
              )}
            </div>

            {/* Published Status */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseData.isPublished}
                  onChange={(e) => handleCourseDataChange('isPublished', e.target.checked)}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={saving}
                />
                <span className="text-sm font-medium text-gray-700">
                  Course is published
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Uncheck to make course a draft
              </p>
            </div>

          </div>
        </div>

        {/* Content Pairs Section */}
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
                      disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/admin/manage-courses')}
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
            {saving ? 'Updating Course...' : 'Update Course'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManageCourse;
