import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";
import { courseService } from "../../api";
import EnrolledCourseCard from "../../components/course/EnrolledCourseCard";

const MyCourses = () => {
  const { user } = useAuth();
  const { getCourseProgress } = useProgress();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enrolled courses on component mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getEnrolledCourses();
        
        const coursesData = data.data;
        
        // Map the API response to match our EnrolledCourseCard component expectations
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
              isEnrolled: true, // All courses in this list are enrolled
              totalVideos: 0,
              level: course.level,
              mode: course.mode,
              language: course.language,
              topics: course.topics
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
            isEnrolled: true, // All courses in this list are enrolled
            totalVideos: course.syllabus.lessons.filter((lesson, index, self) => 
              index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
            ).reduce((total, lesson) => 
              total + (lesson.materials.filter(m => m.type === 'VIDEO').length), 0),
            level: course.level,
            mode: course.mode,
            language: course.language,
            topics: course.topics
          };
        });

        setEnrolledCourses(mappedCourses);
        setError(null);
      } catch (err) {
        setError(`Request failed with status code ${err.status}: ${err.message}`);
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <section className="container mx-auto pt-2 pb-2 px-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-gray-600 mt-4">Loading your courses...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto pt-2 pb-2 px-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto pt-2 pb-2 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Enrolled Courses</h2>
            <p className="text-gray-600 mb-4">You are not enrolled in any courses yet.</p>
            <a 
              href="/courses" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
            >
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* Course Statistics */}
        {enrolledCourses.length > 0 && (
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold text-indigo-600">{enrolledCourses.length}</h3>
                <p className="text-gray-600 mt-2">Enrolled Courses</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-600">
                  {enrolledCourses.filter(course => getCourseProgress(course.id, course.totalVideos) === 100).length}
                </h3>
                <p className="text-gray-600 mt-2">Completed Courses</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-600">
                  {Math.round(
                    enrolledCourses.reduce((acc, course) => 
                      acc + getCourseProgress(course.id, course.totalVideos), 0
                    ) / enrolledCourses.length
                  )}%
                </h3>
                <p className="text-gray-600 mt-2">Average Progress</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCourses;