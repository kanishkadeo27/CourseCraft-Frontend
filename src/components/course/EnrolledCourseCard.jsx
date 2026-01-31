import { useNavigate } from "react-router-dom";
import { useProgress } from "../../context/ProgressContext";

const EnrolledCourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { getCourseProgress } = useProgress();

  const {
    id,
    courseName,
    courseDescription,
    trainer,
    trainerImage,
    rating,
    duration,
    imageId,
    level,
    mode,
    language,
    totalVideos
  } = course;

  // Get progress for this course
  const progress = getCourseProgress(id, totalVideos);

  // Function to get the correct image source
  const getImageSrc = (imageId) => {
    if (typeof imageId === 'string' && imageId.startsWith('http')) {
      return imageId;
    }
    if (typeof imageId === 'string' && imageId.startsWith('/')) {
      return imageId;
    }
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
      {/* Progress Badge */}
      {progress > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
        </div>
      )}

      {/* Course Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getImageSrc(imageId)}
          alt={courseName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Completion Status Overlay */}
        {progress === 100 && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
            <div className="bg-green-500 text-white rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
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
          {progress === 100 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Completed
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

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Metadata Row - Rating and Duration */}
        <div className="flex items-center justify-between mb-6">
          <StarRating rating={rating} />
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <ClockIcon />
            <span className="font-medium">{duration}</span>
            <span className="text-xs">Lessons</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/courses/${id}/classroom`, { 
              state: { 
                courseData: course 
              } 
            })}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors duration-200"
          >
            {progress === 100 ? 'Review Course' : 'Continue Learning'}
          </button>
          <button 
            onClick={() => navigate(`/courses/${id}`)}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;