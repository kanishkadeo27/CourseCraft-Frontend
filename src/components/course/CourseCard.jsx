import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const {
    id,
    courseName,
    courseDescription,
    trainer,
    trainerImage,
    rating,
    price,
    duration,
    imageId,
    level,
    mode,
    language,
    currentEnrollment
  } = course;

  // Function to get the correct image source
  const getImageSrc = (imageId) => {
    // If imageId is a full URL (from backend), use it directly
    if (typeof imageId === 'string' && imageId.startsWith('http')) {
      return imageId;
    }
    
    // If imageId is a path starting with /, use it directly
    if (typeof imageId === 'string' && imageId.startsWith('/')) {
      return imageId;
    }
    
    // For other formats, return as is
    return imageId;
  };

  // Star Rating Component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  // Clock Icon Component
  const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  );

  // User Icon Component
  const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Course Image with Price Badge */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getImageSrc(imageId)}
          alt={courseName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Glassmorphism Price Badge */}
        <div className="absolute bottom-4 right-4">
          {price === 0 ? (
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-3 py-1.5">
              <span className="text-white font-semibold text-sm drop-shadow-lg">FREE</span>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-black/20 border border-white/30 rounded-full px-3 py-1.5">
              <span className="text-white font-semibold text-sm drop-shadow-lg">₹{price.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {courseName}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {courseDescription}
        </p>

        {/* Course Metadata Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {level && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {level}
            </span>
          )}
          {mode && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {mode}
            </span>
          )}
          {language && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              {language}
            </span>
          )}
        </div>

        {/* Instructor Row */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={trainerImage}
            alt={trainer}
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex items-center gap-1 text-gray-600">
            <UserIcon />
            <span className="text-sm font-medium">{trainer}</span>
          </div>
        </div>

        {/* Metadata Row - Rating, Duration, and Enrollment */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <StarRating rating={rating} />
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <ClockIcon />
                <span className="font-medium">{duration}</span>
                <span className="text-xs">Lessons</span>
              </div>
              {currentEnrollment > 0 && (
                <div className="flex items-center gap-1">
                  <UserIcon />
                  <span className="font-medium">{currentEnrollment}</span>
                  <span className="text-xs">enrolled</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/courses/${id}`)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;