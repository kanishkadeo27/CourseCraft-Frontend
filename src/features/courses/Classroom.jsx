import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';

const Classroom = () => {
  const { id } = useParams(); // Course ID from URL
  const { markVideoCompleted, markVideoIncomplete, isVideoCompleted, getCourseProgress } = useProgress();
  const [selectedVideo, setSelectedVideo] = useState(0);

  // Mock course data with videos - replace with API call
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Mock course data - replace with actual API call
    setCourse({
      id: parseInt(id),
      courseName: "React Fundamentals",
      videos: [
        { 
          id: 1, 
          title: "Introduction to React", 
          duration: "10:30", 
          url: "https://www.youtube.com/embed/SqcY0GlETPk" 
        },
        { 
          id: 2, 
          title: "JSX and Components", 
          duration: "15:45", 
          url: "https://www.youtube.com/embed/Tn6-PIqc4UM" 
        },
        { 
          id: 3, 
          title: "Props and State", 
          duration: "20:15", 
          url: "https://www.youtube.com/embed/O6P86uwfdR0" 
        },
        { 
          id: 4, 
          title: "Event Handling", 
          duration: "12:30", 
          url: "https://www.youtube.com/embed/Rh3tobg7hEo" 
        },
        { 
          id: 5, 
          title: "Hooks Introduction", 
          duration: "18:20", 
          url: "https://www.youtube.com/embed/TNhaISOUy6Q" 
        },
      ]
    });
  }, [id]);

  if (!course) {
    return <div className="text-center mt-20">Loading classroom...</div>;
  }

  const currentVideo = course.videos[selectedVideo];
  const progress = getCourseProgress(course.id, course.videos.length);

  const handleVideoComplete = (videoId) => {
    markVideoCompleted(course.id, videoId);
  };

  const handleVideoIncomplete = (videoId) => {
    markVideoIncomplete(course.id, videoId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.courseName}</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 rounded-full px-4 py-2">
              <span className="text-indigo-800 font-semibold">Progress: {progress}%</span>
            </div>
            <div className="bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-700">
                {course.videos.filter(video => isVideoCompleted(course.id, video.id)).length} / {course.videos.length} videos completed
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={currentVideo.url}
                  title={currentVideo.title}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              
              {/* Video Controls */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
                <p className="text-gray-600 mb-4">Duration: {currentVideo.duration}</p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVideoComplete(currentVideo.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isVideoCompleted(course.id, currentVideo.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isVideoCompleted(course.id, currentVideo.id) ? '✓ Completed' : 'Mark as Complete'}
                  </button>
                  
                  {isVideoCompleted(course.id, currentVideo.id) && (
                    <button
                      onClick={() => handleVideoIncomplete(currentVideo.id)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Mark as Incomplete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Videos</h3>
              
              <div className="space-y-3">
                {course.videos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedVideo === index
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{video.title}</h4>
                        <p className="text-gray-600 text-xs mt-1">{video.duration}</p>
                      </div>
                      
                      <div className="ml-3">
                        {isVideoCompleted(course.id, video.id) ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;