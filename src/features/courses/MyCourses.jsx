import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";
import CourseCard from "../../components/course/CourseCard";

const MyCourses = () => {
  const { user } = useAuth();
  const { getCourseProgress } = useProgress();
  
  // Mock enrolled courses data - later from API
  const enrolledCourses = [
    {
      id: 1,
      courseName: "React Fundamentals",
      courseDescription: "Learn React from scratch with hands-on projects and real-world examples",
      trainer: "John Doe",
      rating: 4.5,
      price: 0, // Free for now
      duration: 30,
      imageId: 1,
      isEnrolled: true,
      totalVideos: 5, // Total number of videos in the course
    },
    {
      id: 2,
      courseName: "Advanced React Patterns",
      courseDescription: "Master advanced React concepts including hooks, context, and performance optimization",
      trainer: "Jane Smith",
      rating: 4.8,
      price: 0, // Free for now
      duration: 45,
      imageId: 1,
      isEnrolled: true,
      totalVideos: 8,
    },
    {
      id: 3,
      courseName: "JavaScript Mastery",
      courseDescription: "Complete JavaScript course covering ES6+, async programming, and modern frameworks",
      trainer: "Mike Johnson",
      rating: 4.7,
      price: 0, // Free for now
      duration: 60,
      imageId: 1,
      isEnrolled: true,
      totalVideos: 12,
    },
  ];

  return (
    <section className="container mx-auto pt-2 pb-2 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">You are not enrolled in any courses yet.</p>
            <p className="text-gray-500 mt-2">Browse our course catalog to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => {
              const progress = getCourseProgress(course.id, course.totalVideos);
              
              return (
                <div key={course.id} className="relative">
                  <CourseCard course={course} user={user} />
                  
                  {/* Progress Overlay */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg px-3 py-2 shadow-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {progress}% Complete
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCourses;
