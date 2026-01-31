import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details from API
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(id);
        const data = response.data; // Extract the actual course data from the response
        
        // Map API response to component expectations
        const mappedCourse = {
          id: data.id,
          backgroundImage: data.thumbnailUrl,
          courseName: data.title,
          description: data.description,
          rating: data.trainer.rating,
          duration: data.syllabus && data.syllabus.lessons ? data.syllabus.lessons.filter((lesson, index, self) => 
            index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
          ).length : 0,
          price: data.price,
          enrolled: data.enrolled,
          courseMode: data.mode,
          studentsEnrolled: data.enrollments,
          courseTopic: data.topics[0],
          courseSubtopic: data.topics[1],
          level: data.level,
          language: data.language,
          topics: data.topics,
          category: data.topics[0],
          subcategory: data.topics[1],
          totalVideos: data.syllabus && data.syllabus.lessons ? data.syllabus.lessons.filter((lesson, index, self) => 
            index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
          ).reduce((total, lesson) => 
            total + (lesson.materials.filter(m => m.type === 'VIDEO').length), 0) : 0,
          totalLessons: data.syllabus && data.syllabus.lessons ? data.syllabus.lessons.filter((lesson, index, self) => 
            index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
          ).length : 0,
          syllabus: data.syllabus,
          trainer: {
            trainerId: data.trainer.id,
            trainerName: data.trainer.name,
            description: data.trainer.description,
            rating: data.trainer.rating,
            imageUrl: data.trainer.imageUrl
          }
        };

        setCourse(mappedCourse);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-gray-600 mt-4">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Course</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors mr-4"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/courses')} 
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Course Image */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-600 to-purple-700 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${course.backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative container mx-auto px-6 py-16 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mr-4">
                {course.level}
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                {course.courseMode}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course.courseName}
            </h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        course.rating >= star ? 'fill-current' : 'fill-gray-400'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-medium">{course.rating}</span>
              </div>
              <span className="text-lg">•</span>
              <span className="text-lg">{course.studentsEnrolled.toLocaleString()} students enrolled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Course Details - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              
              {/* Course Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{course.duration}</div>
                  <div className="text-sm text-blue-700 font-medium">Lessons</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Price</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{course.courseMode}</div>
                  <div className="text-sm text-purple-700 font-medium">Mode</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{course.language}</div>
                  <div className="text-sm text-orange-700 font-medium">Language</div>
                </div>
              </div>

              {/* Course Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>

              {/* Course Topics */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Topics</h2>
                <div className="flex flex-wrap gap-3">
                  {course.topics.length > 0 ? (
                    course.topics.map((topic, index) => (
                      <span key={index} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                        {topic}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                        {course.courseTopic}
                      </span>
                      <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                        {course.courseSubtopic}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Info Cards */}
              {course.totalVideos > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="text-2xl font-bold text-red-600 mb-1">{course.totalVideos}</div>
                    <div className="text-sm text-red-700 font-medium">Videos</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">{course.totalLessons}</div>
                    <div className="text-sm text-indigo-700 font-medium">Lessons</div>
                  </div>
                </div>
              )}

              {/* Instructor Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Your Instructor</h2>
                <div className="flex items-start space-x-4">
                  <img
                    src={course.trainer.imageUrl}
                    alt={course.trainer.trainerName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{course.trainer.trainerName}</h4>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              course.trainer.rating >= star ? 'fill-current' : 'fill-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{course.trainer.rating} rating</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.trainer.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              
              {/* Price Display */}
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-100">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {course.price === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>₹{course.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">One-time payment</p>
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-3">
                {!user ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
                  >
                    Login to Enroll
                  </button>
                ) : !course.enrolled ? (
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await courseService.enrollInCourse(id);
                        window.location.reload();
                      } catch (error) {
                        let errorMessage = 'Failed to enroll. Please try again.';
                        if (error.status === 403) {
                          errorMessage = 'Access denied. Please check if you have permission to enroll in courses.';
                        } else if (error.status === 401) {
                          errorMessage = 'Authentication required. Please login again.';
                        } else if (error.message) {
                          errorMessage = error.message;
                        }
                        
                        setError(errorMessage);
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 font-medium shadow-sm ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/courses/${id}/classroom`)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm"
                  >
                    Go to Classroom
                  </button>
                )}

                {/* View Syllabus Button */}
                <button
                  onClick={() => navigate(`/courses/${course.id}/syllabus`, { 
                    state: { 
                      courseData: course,
                      syllabusData: course.syllabus 
                    } 
                  })}
                  className="w-full border-2 border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium"
                >
                  View Syllabus
                </button>
              </div>

              {/* Course Features */}
              <div className="px-6 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">This course includes:</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{course.totalVideos} video lectures</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{course.totalLessons} structured lessons</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Downloadable PDF materials</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Online learning format</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Course in {course.language}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;