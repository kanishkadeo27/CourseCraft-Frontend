import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { courseService } from '../../api';
import PdfViewer from '../../components/common/PdfViewer';

const Classroom = () => {
  const { id } = useParams(); // Course ID from URL
  const { markVideoCompleted, markVideoIncomplete, isVideoCompleted, getCourseProgress } = useProgress();
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [selectedContent, setSelectedContent] = useState('video'); // 'video' or 'pdf'
  const [selectedPdf, setSelectedPdf] = useState(0);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course content from API
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseContent(id);
        
        // Map API response to component expectations
        const mappedCourse = {
          id: parseInt(id),
          courseName: data.title || data.courseName,
          videos: data.syllabus?.lessons?.flatMap(lesson => 
            lesson.materials?.filter(material => material.type === 'VIDEO').map(video => ({
              id: video.id,
              title: video.title,
              duration: "N/A", // Duration not provided in API
              url: video.path.includes('youtube.com') ? video.path.replace('watch?v=', 'embed/') : video.path,
              lessonName: lesson.lessonName,
              lessonNo: lesson.lessonNo
            }))
          ) || [],
          pdfs: data.syllabus?.lessons?.flatMap(lesson => 
            lesson.materials?.filter(material => material.type === 'PDF').map(pdf => ({
              id: pdf.id,
              title: pdf.title,
              filename: pdf.title.toLowerCase().replace(/\s+/g, '_') + '.pdf',
              url: pdf.path,
              description: `Study material for ${lesson.lessonName}`,
              lessonName: lesson.lessonName,
              lessonNo: lesson.lessonNo
            }))
          ) || []
        };

        setCourse(mappedCourse);
        setError(null);
      } catch (err) {
        // If API fails, provide fallback data for enrolled users
        const fallbackCourse = {
          id: parseInt(id),
          courseName: "Sample Course - Classroom",
          videos: [
            {
              id: 1,
              title: "Introduction to Programming",
              duration: "15 min",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video
              lessonName: "Getting Started",
              lessonNo: 1
            },
            {
              id: 2,
              title: "Variables and Data Types",
              duration: "20 min",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video
              lessonName: "Basic Concepts",
              lessonNo: 2
            },
            {
              id: 3,
              title: "Control Structures",
              duration: "25 min",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video
              lessonName: "Programming Logic",
              lessonNo: 3
            }
          ],
          pdfs: [
            {
              id: 1,
              title: "Course Handbook",
              filename: "course_handbook.pdf",
              url: "/pdf/study-material/spring_boot_tutorial.pdf",
              description: "Complete guide to the course materials and exercises",
              lessonName: "Getting Started",
              lessonNo: 1
            },
            {
              id: 2,
              title: "Programming Exercises",
              filename: "programming_exercises.pdf",
              url: "/pdf/study-material/spring_boot_tutorial.pdf",
              description: "Practice problems and coding challenges",
              lessonName: "Basic Concepts",
              lessonNo: 2
            }
          ]
        };
        
        setCourse(fallbackCourse);
        setError("Unable to load course content from server. Showing sample classroom data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseContent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-gray-600 mt-4">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Classroom</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Course content not found</div>
      </div>
    );
  }

  const currentVideo = course.videos.length > 0 ? course.videos[selectedVideo] : null;
  const currentPdf = course.pdfs.length > 0 ? course.pdfs[selectedPdf] : null;
  const progress = getCourseProgress(course.id, course.videos.length);

  const handleVideoComplete = (videoId) => {
    markVideoCompleted(course.id, videoId);
  };

  const handleVideoIncomplete = (videoId) => {
    markVideoIncomplete(course.id, videoId);
  };

  const switchToVideo = (index) => {
    setSelectedContent('video');
    setSelectedVideo(index);
  };

  const switchToPdf = (index) => {
    setSelectedContent('pdf');
    setSelectedPdf(index);
  };

  // Set default content type based on available content
  useEffect(() => {
    if (course) {
      if (course.videos.length > 0) {
        setSelectedContent('video');
      } else if (course.pdfs.length > 0) {
        setSelectedContent('pdf');
      }
    }
  }, [course]);

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      
      {/* Warning Banner for Fallback Data */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mx-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-800">Demo Mode: Backend Disconnected</p>
              <p className="text-sm mt-1 text-amber-700">{error}</p>
              <p className="text-sm mt-2 text-gray-600">💡 Start your backend server to access real course content</p>
            </div>
          </div>
        </div>
      )}

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
          
          {/* Content Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              
              {/* Content Type Tabs */}
              <div className="bg-gray-100 px-6 py-3 border-b">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedContent('video')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedContent === 'video'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    📹 Videos
                  </button>
                  <button
                    onClick={() => setSelectedContent('pdf')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedContent === 'pdf'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    📄 Study Materials
                  </button>
                </div>
              </div>

              {/* Video Player */}
              {selectedContent === 'video' && (
                <>
                  {currentVideo ? (
                    <>
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
                        {currentVideo.lessonName && (
                          <p className="text-gray-600 mb-2">Lesson {currentVideo.lessonNo}: {currentVideo.lessonName}</p>
                        )}
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
                    </>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Videos Available</h3>
                      <p className="text-gray-600">Video content for this course will be available soon.</p>
                    </div>
                  )}
                </>
              )}

              {/* PDF Viewer */}
              {selectedContent === 'pdf' && (
                <>
                  {currentPdf ? (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentPdf.title}</h2>
                      {currentPdf.lessonName && (
                        <p className="text-gray-600 mb-2">Lesson {currentPdf.lessonNo}: {currentPdf.lessonName}</p>
                      )}
                      <p className="text-gray-600 mb-4">{currentPdf.description}</p>
                      
                      <div className="mt-4">
                        <PdfViewer
                          pdfUrl={currentPdf.url}
                          title={currentPdf.title}
                          height="600px"
                          showControls={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Study Materials Available</h3>
                      <p className="text-gray-600">Study materials for this course will be available soon.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Content</h3>
              
              {/* Videos Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  📹 Videos ({course.videos.length})
                </h4>
                <div className="space-y-2">
                  {course.videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => switchToVideo(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContent === 'video' && selectedVideo === index
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-sm">{video.title}</h5>
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

              {/* PDFs Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  📄 Study Materials ({course.pdfs.length})
                </h4>
                <div className="space-y-2">
                  {course.pdfs.map((pdf, index) => (
                    <div
                      key={pdf.id}
                      onClick={() => switchToPdf(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContent === 'pdf' && selectedPdf === index
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm truncate">{pdf.title}</h5>
                          <p className="text-gray-600 text-xs mt-1 truncate">{pdf.description}</p>
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
    </div>
  );
};

export default Classroom;