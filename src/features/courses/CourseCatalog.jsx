import { useState, useEffect } from "react";
import CourseCard from "../../components/course/CourseCard.jsx";
import { useAuth } from "../../context/AuthContext";
import { searchService } from "../../api";

const CourseCatalog = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to normalize role
  const normalizeRole = (role) => {
    if (!role) return null;
    const lowerRole = role.toLowerCase();
    if (lowerRole.startsWith('role_')) {
      return lowerRole.replace('role_', '');
    }
    return lowerRole;
  };

  const normalizedUserRole = normalizeRole(user?.role);

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await searchService.getAllCourses();
        
        const coursesData = data.data;
        
        if (!coursesData || !Array.isArray(coursesData)) {
          throw new Error('Invalid course data received from server');
        }
        
        // Map the API response to match our CourseCard component expectations
        const mappedCourses = coursesData.map(course => {
          // Skip courses without syllabus data
          if (!course.syllabus || !course.syllabus.lessons) {
            return {
              id: course.id,
              courseName: course.title,
              courseDescription: course.description,
              trainer: course.trainer.name,
              trainerImage: course.trainer.imageUrl,
              rating: course.trainer.rating,
              price: course.price,
              duration: 0,
              imageId: course.thumbnailUrl,
              isEnrolled: course.enrolled,
              totalVideos: 0,
              level: course.level,
              mode: course.mode,
              language: course.language,
              topics: course.topics,
              category: course.topics[0],
              subcategory: course.topics[1],
              currentEnrollment: course.enrollments
            };
          }

          return {
            id: course.id,
            courseName: course.title,
            courseDescription: course.description,
            trainer: course.trainer.name,
            trainerImage: course.trainer.imageUrl,
            rating: course.trainer.rating,
            price: course.price,
            duration: course.syllabus.lessons.filter((lesson, index, self) => 
              index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
            ).length,
            imageId: course.thumbnailUrl,
            isEnrolled: course.enrolled,
            totalVideos: course.syllabus.lessons.filter((lesson, index, self) => 
              index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
            ).reduce((total, lesson) => 
              total + (lesson.materials.filter(m => m.type === 'VIDEO').length), 0),
            level: course.level,
            mode: course.mode,
            language: course.language,
            topics: course.topics,
            category: course.topics[0],
            subcategory: course.topics[1],
            currentEnrollment: course.enrollments
          };
        });

        setCourses(mappedCourses);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="pt-2 pb-2 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600 mt-4">Loading courses...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment if the server is starting up</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-2 pb-2 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Courses</h2>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-2 pb-2 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-xl text-gray-600">Discover our comprehensive collection of courses</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available</h2>
            <p className="text-gray-600">Check back later for new courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              return (
                <div key={course.id} className="relative">
                  <CourseCard course={course} />
                  
                  {/* Enrollment Status Badge - Only show for regular users */}
                  {normalizedUserRole === "user" && (
                    <div className="absolute top-4 right-4">
                      {course.isEnrolled ? (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Enrolled
                        </span>
                      ) : (
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Available
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Course Statistics */}
        {courses.length > 0 && (
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-indigo-600">{courses.length}</h3>
              <p className="text-gray-600 mt-2">Total Courses Available</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseCatalog;
