import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CourseCard = ({ course, user }) => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);

  const {
    id,
    courseName,
    courseDescription,
    trainer,
    rating,
    price,
    duration,
    imageId,
  } = course;

  // Helper function to normalize role
  const normalizeRole = (role) => {
    if (!role) return null;
    const lowerRole = role.toLowerCase();
    if (lowerRole.startsWith('role_')) {
      return lowerRole.replace('role_', '');
    }
    return lowerRole;
  };

  const userRole = normalizeRole(user?.role);

  // Function to handle enrollment
  const handleEnrollment = () => {
    setIsEnrolled(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`/image/courses/course${imageId}.jpg`}
          alt={courseName}
          className="w-full h-full object-cover"
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          {price === 0 ? (
            <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              FREE
            </span>
          ) : (
            <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ₹{price}/-
            </span>
          )}
        </div>
        {/* Instructor Avatar */}
        <div className="absolute bottom-4 left-4">
          <img
            src={`/image/teachers/author${imageId}.jpg`}
            alt={trainer}
            className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {courseName}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {courseDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  rating >= star ? 'fill-current' : 'fill-gray-300'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">{rating}</span>
        </div>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
          {/* Show enrollment info only for regular users */}
          {userRole === "user" && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2.4k Enrolled
            </span>
          )}
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {duration} Days
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* View Details Button - Always visible */}
          <button 
            onClick={() => navigate(`/courses/${id}`)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200 border border-gray-300"
          >
            View Details
          </button>

          {/* Role-based Action Button */}
          {!user && (
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Register Now
            </button>
          )}
          {userRole === "admin" && (
            <button
              onClick={() => navigate(`/admin/courses/manage/${id}`)}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Manage Course
            </button>
          )}
          {userRole === "user" && (
            <>
              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/courses/${id}/classroom`)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Go to Classroom
                </button>
              ) : (
                <button
                  onClick={handleEnrollment}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Register Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
