import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const CourseSyllabus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getUserRole } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = getUserRole();

  // Check if we have course data passed from CourseDetails
  const passedCourseData = location.state?.courseData;
  const passedSyllabusData = location.state?.syllabusData;

  // Load course syllabus data
  useEffect(() => {
    const loadCourseSyllabus = async () => {
      try {
        setLoading(true);
        
        // If we have passed data from CourseDetails, use it
        if (passedCourseData && passedSyllabusData) {
          const mappedCourse = {
            id: passedCourseData.id,
            courseName: passedCourseData.courseName,
            courseDescription: passedCourseData.description,
            trainer: passedCourseData.trainer.trainerName,
            trainerImage: passedCourseData.trainer.imageUrl,
            price: passedCourseData.price,
            level: passedCourseData.level,
            mode: passedCourseData.courseMode,
            language: passedCourseData.language,
            topics: passedCourseData.topics,
            lessons: passedSyllabusData.lessons,
            totalLessons: passedCourseData.totalLessons,
            enrolled: passedCourseData.enrolled
          };
          
          setCourse(mappedCourse);
          setError(null);
        } else {
          // Fetch from API if no passed data
          const response = await courseService.getCourseById(id);
          const data = response.data; // Extract the actual course data from the response
          
          // Check if syllabus exists
          if (!data.syllabus || !data.syllabus.lessons) {
            const mappedCourse = {
              id: data.id,
              courseName: data.title,
              courseDescription: data.description,
              trainer: data.trainer.name,
              trainerImage: data.trainer.imageUrl,
              price: data.price,
              level: data.level,
              mode: data.mode,
              language: data.language,
              topics: data.topics,
              lessons: [],
              totalLessons: 0,
              enrolled: data.enrolled
            };
            
            setCourse(mappedCourse);
            setError(null);
          } else {
            const mappedCourse = {
              id: data.id,
              courseName: data.title,
              courseDescription: data.description,
              trainer: data.trainer.name,
              trainerImage: data.trainer.imageUrl,
              price: data.price,
              level: data.level,
              mode: data.mode,
              language: data.language,
              topics: data.topics,
              lessons: data.syllabus.lessons,
              totalLessons: data.syllabus.lessons.length,
              enrolled: data.enrolled
            };
            
            setCourse(mappedCourse);
            setError(null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourseSyllabus();
    }
  }, [id, passedCourseData, passedSyllabusData]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-gray-600 mt-4">Loading syllabus...</p>
        </div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Syllabus</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(`/courses/${id}`)} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Course Details
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pt-2 pb-2">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Course Details</span>
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Syllabus</h1>
              <p className="text-xl text-gray-600">Detailed curriculum and learning path</p>
            </div>
          </div>

          {/* Course Overview Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Course Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{course.courseName}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{course.courseDescription}</p>
                
                {/* Course Topics */}
                {course.topics.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Lessons:</span>
                      <span className="font-medium">{course.totalLessons}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-green-600">
                        {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-medium">{course.mode}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{course.language}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        {course.trainerImage && (
                          <img
                            src={course.trainerImage}
                            alt={course.trainer}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                          />
                        )}
                        <div>
                          <div className="text-sm text-gray-600">Instructor</div>
                          <div className="font-medium">{course.trainer}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Content */}
          {course.lessons.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              
              <div className="space-y-4">
                {/* Deduplicate lessons by lessonNo and sort them */}
                {course.lessons
                  .filter((lesson, index, self) => 
                    index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
                  )
                  .sort((a, b) => a.lessonNo - b.lessonNo)
                  .map((lesson, index) => (
                  <div key={lesson.id || index} className="border border-gray-200 rounded-lg">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Lesson {lesson.lessonNo}: {lesson.lessonName}
                          </h3>
                          
                          {/* Lesson Content Summary (public view - no detailed materials) */}
                          {lesson.materials && lesson.materials.length > 0 && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  {lesson.materials.length} learning materials included
                                </span>
                                <div className="flex gap-1">
                                  {lesson.materials.some(m => m.type === 'VIDEO') && (
                                    <span className="w-5 h-5 text-red-500" title="Video content">
                                      <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                  {lesson.materials.some(m => m.type === 'PDF') && (
                                    <span className="w-5 h-5 text-blue-500" title="PDF materials">
                                      <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {course.enrolled 
                                  ? "Detailed content available in classroom" 
                                  : "Detailed content available after enrollment"
                                }
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                            Lesson {lesson.lessonNo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Syllabus Coming Soon</h3>
              <p className="text-gray-600">The detailed curriculum for this course will be available soon.</p>
            </div>
          )}

          {/* Call-to-Action for Users */}
          {user && userRole === "user" && (
            <>
              {!course.enrolled ? (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-8 text-white text-center mt-8">
                  <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
                  <p className="text-indigo-100 mb-6">
                    Enroll now to access all course materials, videos, and interactive content.
                  </p>
                  <button
                    onClick={() => navigate(`/courses/${id}`)}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  >
                    Enroll in Course
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-sm p-8 text-white text-center mt-8">
                  <h3 className="text-2xl font-bold mb-4">Ready to Continue Learning?</h3>
                  <p className="text-green-100 mb-6">
                    Access your classroom to watch videos, download materials, and track your progress.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => navigate(`/courses/${id}/classroom`)}
                      className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                    >
                      Go to Classroom
                    </button>
                    <button
                      onClick={() => navigate(`/courses/${id}`)}
                      className="bg-green-600 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                    >
                      Course Details
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Login Call-to-Action for Guest Users */}
          {!user && (
            <div className="bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl shadow-sm p-8 text-white text-center mt-8">
              <h3 className="text-2xl font-bold mb-4">Join Thousands of Learners</h3>
              <p className="text-blue-100 mb-6">
                Create an account to enroll in this course and start your learning journey.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Sign Up / Login
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default CourseSyllabus;