import CourseCard from "../../components/course/CourseCard.jsx";
import { useAuth } from "../../context/AuthContext";

// Mock data for all available courses
const allCourses = [
  {
    id: 1,
    courseName: "React Fundamentals",
    courseDescription: "Learn React from scratch with hands-on projects and real-world examples",
    trainer: "John Doe",
    rating: 4.5,
    price: 0,
    duration: 30,
    imageId: 1,
    isEnrolled: true, // User is enrolled in this course
    totalVideos: 5,
  },
  {
    id: 2,
    courseName: "Advanced React Patterns",
    courseDescription: "Master advanced React concepts including hooks, context, and performance optimization",
    trainer: "Jane Smith",
    rating: 4.8,
    price: 0,
    duration: 45,
    imageId: 1,
    isEnrolled: true, // User is enrolled in this course
    totalVideos: 8,
  },
  {
    id: 3,
    courseName: "JavaScript Mastery",
    courseDescription: "Complete JavaScript course covering ES6+, async programming, and modern frameworks",
    trainer: "Mike Johnson",
    rating: 4.7,
    price: 0,
    duration: 60,
    imageId: 1,
    isEnrolled: false, // User is NOT enrolled in this course
    totalVideos: 12,
  },
  {
    id: 4,
    courseName: "Node.js Backend Development",
    courseDescription: "Build scalable backend applications with Node.js, Express, and MongoDB",
    trainer: "Sarah Wilson",
    rating: 4.6,
    price: 0,
    duration: 50,
    imageId: 1,
    isEnrolled: false, // User is NOT enrolled in this course
    totalVideos: 10,
  },
  {
    id: 5,
    courseName: "Python for Data Science",
    courseDescription: "Learn Python programming for data analysis, visualization, and machine learning",
    trainer: "David Chen",
    rating: 4.9,
    price: 0,
    duration: 70,
    imageId: 1,
    isEnrolled: true, // User is enrolled in this course
    totalVideos: 15,
  },
  {
    id: 6,
    courseName: "Full Stack Web Development",
    courseDescription: "Complete web development course covering frontend and backend technologies",
    trainer: "Emily Rodriguez",
    rating: 4.7,
    price: 0,
    duration: 90,
    imageId: 1,
    isEnrolled: false, // User is NOT enrolled in this course
    totalVideos: 20,
  },
];

const CourseCatalog = () => {
  const { user } = useAuth();

  return (
    <section className="pt-2 pb-2 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-xl text-gray-600">Discover our comprehensive collection of courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map((course) => {
            return (
              <div key={course.id} className="relative">
                <CourseCard course={course} user={user} />
                
                {/* Enrollment Status Badge */}
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
              </div>
            );
          })}
        </div>

        {/* Course Statistics */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">{allCourses.length}</h3>
              <p className="text-gray-600 mt-2">Total Courses</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-600">
                {allCourses.filter(course => course.isEnrolled).length}
              </h3>
              <p className="text-gray-600 mt-2">Enrolled Courses</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-600">
                {allCourses.filter(course => !course.isEnrolled).length}
              </h3>
              <p className="text-gray-600 mt-2">Available to Enroll</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCatalog;
