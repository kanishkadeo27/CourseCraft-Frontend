import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [trainer, setTrainer] = useState(null);

  // Mock data (replace with API later)
  useEffect(() => {
    // Simulate API call for course data
    setCourse({
      id,
      backgroundImage: "/image/courses/course1.jpg",
      courseName: "Complete Java Development Bootcamp",
      description: "Master Java programming from basics to advanced concepts. Learn object-oriented programming, data structures, algorithms, Spring Boot, microservices, and build real-world applications. This comprehensive course covers everything you need to become a professional Java developer.",
      rating: 4.8,
      duration: "12 weeks",
      price: 0, // Free
      enrolled: true,
      courseMode: "Online",
      studentsEnrolled: 1247,
      courseTopic: "Programming",
      courseSubtopic: "Java Development"
    });

    // Simulate API call for trainer data
    setTrainer({
      trainerId: 1,
      trainerName: "Mohd Khushhal",
      description: "Senior Software Engineer with 10+ years of experience in enterprise Java applications. Expert in Spring Boot, microservices architecture, and cloud technologies.",
      rating: 4.9,
      imageUrl: "/image/teachers/author1.jpg"
    });
  }, [id]);

  if (!course || !trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading course details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2 pb-2">
      {/* Course Header with Background */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${course.backgroundImage})` 
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl text-white">
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
                  <div className="text-sm text-blue-700 font-medium">Duration</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {course.price === 0 ? "FREE" : `₹${course.price}`}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Price</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{course.courseMode}</div>
                  <div className="text-sm text-purple-700 font-medium">Mode</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {course.enrolled ? "Enrolled" : "Available"}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">Status</div>
                </div>
              </div>

              {/* Course Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>

              {/* Course Topics */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Topics</h2>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                    {course.courseTopic}
                  </span>
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                    {course.courseSubtopic}
                  </span>
                </div>
              </div>

              {/* Course Statistics */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{course.studentsEnrolled.toLocaleString()}</div>
                    <div className="text-gray-600 font-medium">Students Enrolled</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{course.rating}</div>
                    <div className="text-gray-600 font-medium">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{course.courseMode}</div>
                    <div className="text-gray-600 font-medium">Learning Mode</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Trainer Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Course Trainer</h3>
                
                <div className="text-center">
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.trainerName}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-100"
                    onError={(e) => {
                      e.target.src = "/image/teachers/author1.jpg";
                    }}
                  />
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{trainer.trainerName}</h4>
                  
                  {/* Trainer Rating */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            trainer.rating >= star ? 'fill-current' : 'fill-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">{trainer.rating}</span>
                  </div>
                  
                  {/* Trainer Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {trainer.description}
                  </p>
                </div>
              </div>

              {/* View Syllabus Button */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                  onClick={() => navigate(`/courses/${course.id}/syllabus`)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-lg"
                >
                  View Syllabus
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
