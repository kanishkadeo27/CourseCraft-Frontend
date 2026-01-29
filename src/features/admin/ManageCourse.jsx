import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { courseService, trainerService } from "../../api";
// import useApi from "../../hooks/useApi";

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [trainers, setTrainers] = useState([]);

  const [course, setCourse] = useState({
    courseId: "",
    courseName: "",
    description: "",
    backgroundImage: "",
    rating: "",
    duration: "",
    price: "",
    courseMode: "Online",
    studentsEnrolled: "",
    courseTopic: "",
    courseSubtopic: "",
    trainerId: ""
  });

  // TODO: Replace with actual API when courseService and trainerService are implemented
  // const { loading: updating, error, execute: updateCourse } = useApi(courseService.updateCourse);
  // const { execute: deleteCourse } = useApi(courseService.deleteCourse);
  // const { execute: fetchTrainers } = useApi(trainerService.getAdminTrainers);

  // Load trainers for dropdown (using mock data for now)
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        // TODO: Replace with actual API call when trainerService is implemented
        // const data = await fetchTrainers();
        // setTrainers(data || []);
        
        // Use mock data for now
        setTrainers([
          { trainerId: 1, trainerName: "John Smith" },
          { trainerId: 2, trainerName: "Sarah Johnson" },
          { trainerId: 3, trainerName: "Mike Wilson" },
          { trainerId: 4, trainerName: "Emily Davis" },
          { trainerId: 5, trainerName: "Mohd Khushhal" }
        ]);
      } catch (err) {
        console.error("Failed to load trainers:", err);
        // Use mock data as fallback
        setTrainers([
          { trainerId: 1, trainerName: "John Smith" },
          { trainerId: 2, trainerName: "Sarah Johnson" },
          { trainerId: 3, trainerName: "Mike Wilson" },
          { trainerId: 4, trainerName: "Emily Davis" },
          { trainerId: 5, trainerName: "Mohd Khushhal" }
        ]);
      }
    };
    loadTrainers();
  }, []);

  // Load course data based on ID (using mock data for now)
  useEffect(() => {
    const loadCourse = async () => {
      try {
        // TODO: Replace with actual API call when courseService is implemented
        // Mock course data
        const mockCourse = {
          courseId: parseInt(id),
          courseName: "Complete Java Development Bootcamp",
          description: "Master Java programming from basics to advanced concepts. Learn object-oriented programming, data structures, algorithms, Spring Boot, microservices, and build real-world applications.",
          backgroundImage: "/image/courses/course1.jpg",
          rating: "4.8",
          duration: "12 weeks",
          price: "0",
          courseMode: "Online",
          studentsEnrolled: "1247",
          courseTopic: "Programming",
          courseSubtopic: "Java Development",
          trainerId: "5"
        };

        setCourse(mockCourse);
      } catch (error) {
        console.error("Error loading course:", error);
        setSubmitStatus('error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id]);

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
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setUpdating(true);

    // Frontend validation
    if (!course.courseName.trim()) {
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (!course.description.trim()) {
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    if (!course.trainerId) {
      setSubmitStatus('error');
      setUpdating(false);
      return;
    }

    try {
      const payload = {
        courseId: course.courseId,
        courseName: course.courseName.trim(),
        description: course.description.trim(),
        backgroundImage: course.backgroundImage.trim() || null,
        rating: course.rating ? parseFloat(course.rating) : 0.0,
        duration: course.duration.trim(),
        price: course.price ? parseFloat(course.price) : 0,
        courseMode: course.courseMode,
        studentsEnrolled: course.studentsEnrolled ? parseInt(course.studentsEnrolled) : 0,
        courseTopic: course.courseTopic.trim(),
        courseSubtopic: course.courseSubtopic.trim(),
        trainerId: parseInt(course.trainerId)
      };

      console.log("Would update course:", payload);

      // TODO: Replace with actual API call when courseService is implemented
      // await updateCourse(course.courseId, payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Course updated successfully (mock)");
      setSubmitStatus('success');
      
      // Redirect to courses list after 2 seconds
      setTimeout(() => {
        navigate("/admin/manage-courses");
      }, 2000);
    } catch (err) {
      console.error("Error updating course:", err);
      setSubmitStatus('error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        // TODO: Replace with actual API call when courseService is implemented
        // await deleteCourse(course.courseId);
        console.log("Would delete course:", course.courseId);
        
        console.log("Course deleted successfully (mock)");
        navigate("/admin/manage-courses");
      } catch (err) {
        console.error("Error deleting course:", err);
        setSubmitStatus('error');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading course data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Course</h1>
          <p className="text-gray-600 mt-2">Update course information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          
          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded transition-opacity duration-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Course updated successfully! Redirecting to courses list...</span>
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
                <span>Failed to update course. Please try again.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Course Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={course.courseName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter course name"
                  required
                  disabled={updating}
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
                  disabled={updating}
                />
              </div>

              {/* Background Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL
                </label>
                <input
                  type="url"
                  name="backgroundImage"
                  value={course.backgroundImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/course-image.jpg"
                  disabled={updating}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={course.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 12 weeks, 3 months"
                  required
                  disabled={updating}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
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
                  disabled={updating}
                />
              </div>

              {/* Course Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseMode"
                  value={course.courseMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={updating}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Rating <span className="text-gray-500">(0.0-5.0)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={course.rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 4.5"
                  disabled={updating}
                />
              </div>

              {/* Course Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courseTopic"
                  value={course.courseTopic}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Programming, Design, Marketing"
                  required
                  disabled={updating}
                />
              </div>

              {/* Course Subtopic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Subtopic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courseSubtopic"
                  value={course.courseSubtopic}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Java Development, React, SEO"
                  required
                  disabled={updating}
                />
              </div>

              {/* Students Enrolled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Students Enrolled
                </label>
                <input
                  type="number"
                  min="0"
                  name="studentsEnrolled"
                  value={course.studentsEnrolled}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                  disabled={updating}
                />
              </div>

              {/* Trainer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Trainer <span className="text-red-500">*</span>
                </label>
                <select
                  name="trainerId"
                  value={course.trainerId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={updating}
                >
                  <option value="">Choose a trainer...</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.trainerId} value={trainer.trainerId}>
                      {trainer.trainerName}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleDelete}
                disabled={updating}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Course
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/manage-courses")}
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
                  {updating ? 'Updating...' : 'Update Course'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
