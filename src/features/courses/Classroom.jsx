import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { courseService } from '../../api';
import PdfViewer from '../../components/common/PdfViewer';

const Classroom = () => {
  const { id } = useParams(); // Course ID from URL
  const location = useLocation();
  const passedCourseData = location.state?.courseData; // Course data passed from EnrolledCourseCard
  const { markVideoCompleted, markVideoIncomplete, isVideoCompleted } = useProgress();
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [selectedContent, setSelectedContent] = useState('video'); // 'video' or 'pdf'
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);

  // Fetch course content from API
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        
        
        // Use passed course data if available, otherwise fetch from API
        let courseData;
        if (passedCourseData) {
          const detailedData = await courseService.getCourseById(id);
          courseData = detailedData.data;
        } else {
          const data = await courseService.getCourseById(id);
          courseData = data.data;
        }
        
        // Map API response to component expectations
        const mappedCourse = {
          id: parseInt(id),
          courseName: courseData.title,
          description: courseData.description,
          trainer: courseData.trainer,
          // Process lessons to group videos and PDFs together
          lessons: courseData.syllabus.lessons.map(lesson => ({
            id: lesson.id,
            lessonName: lesson.lessonName,
            lessonNo: lesson.lessonNo,
            video: lesson.materials.find(material => material.type === 'VIDEO'),
            pdf: lesson.materials.find(material => material.type === 'PDF'),
            materials: lesson.materials
          })) || [],
          // Keep separate arrays for backward compatibility
          videos: courseData.syllabus.lessons.flatMap(lesson => 
            lesson.materials.filter(material => material.type === 'VIDEO').map(video => ({
              id: video.id,
              title: video.title,
              duration: video.duration,
              url: video.path.includes('youtube.com') ? video.path.replace('watch?v=', 'embed/') : video.path,
              lessonName: lesson.lessonName,
              lessonNo: lesson.lessonNo
            }))
          ) || [],
          pdfs: courseData.syllabus.lessons.flatMap(lesson => 
            lesson.materials.filter(material => material.type === 'PDF').map(pdf => ({
              id: pdf.id,
              title: pdf.title,
              filename: pdf.title.toLowerCase().replace(/\s+/g, '_') + '.pdf',
              url: pdf.path,
              description: `Study material for ${lesson.lessonName}`,
              lessonName: lesson.lessonName,
              lessonNo: lesson.lessonNo
            }))
          )
        };

        setCourse(mappedCourse);
        
        // Set default content type based on available content
        const firstLesson = mappedCourse.lessons[0];
        if (firstLesson.video) {
          setSelectedContent('video');
        } else if (firstLesson.pdf) {
          setSelectedContent('pdf');
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseContent();
    }
  }, [id, passedCourseData]);

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
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The requested course could not be found.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentLesson = course && course.lessons && course.lessons.length > 0 ? course.lessons[selectedLesson] : null;
  const currentVideo = currentLesson?.video;
  const currentPdf = currentLesson?.pdf;
  
  // Calculate progress based on completed lessons
  const totalLessons = course.lessons.length;
  const completedLessons = course.lessons.filter(lesson => 
    lesson.video ? isVideoCompleted(course.id, lesson.video.id) : false
  ).length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  const handleLessonComplete = (lessonId, videoId) => {
    markVideoCompleted(course.id, videoId);
  };

  const handleLessonIncomplete = (lessonId, videoId) => {
    markVideoIncomplete(course.id, videoId);
  };

  const switchToLesson = (index) => {
    setSelectedLesson(index);
    setVideoError(false); // Reset video error when switching lessons
    const lesson = course.lessons[index];
    if (lesson.video) {
      setSelectedContent('video');
    } else if (lesson.pdf) {
      setSelectedContent('pdf');
    }
  };

  const isLessonCompleted = (lesson) => {
    return lesson.video ? isVideoCompleted(course.id, lesson.video.id) : false;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      
      {/* Warning Banner for API Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Failed to Load Course Content</p>
              <p className="text-sm mt-1 text-red-700">{error}</p>
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
                {completedLessons} / {totalLessons} lessons completed
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Content Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-[600px] flex flex-col">
              
              {/* Content Type Tabs */}
              <div className="bg-gray-100 px-6 py-3 border-b flex-shrink-0">
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
                    <div className="flex-1 flex flex-col">
                      {/* Video Player Area */}
                      <div className="flex-1 bg-black relative">
                        {(() => {
                          let videoUrl = currentVideo.path;
                          let embedUrl = videoUrl;
                          
                          // Handle different YouTube URL formats
                          if (videoUrl.includes('youtube.com/watch?v=')) {
                            const videoId = videoUrl.split('v=')[1]?.split('&')[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          } else if (videoUrl.includes('youtu.be/')) {
                            const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          } else if (videoUrl.includes('youtube.com/embed/')) {
                            embedUrl = videoUrl;
                          }
                          
                          return (
                            <iframe
                              width="100%"
                              height="100%"
                              src={embedUrl}
                              title={currentVideo.title}
                              style={{ border: 0 }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full"
                              onError={() => {
                                setVideoError(true);
                              }}
                              onLoad={() => {
                                setVideoError(false);
                              }}
                            />
                          );
                        })()}
                        
                        {videoError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-yellow-800">Video Loading Issue</p>
                                  <p className="text-sm text-yellow-700">If the video doesn't load, try opening it directly in YouTube.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Video Controls - Always Visible */}
                      <div className="p-4 bg-white border-t flex-shrink-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">{currentVideo.title}</h2>
                            <p className="text-sm text-gray-600">
                              Lesson {currentLesson.lessonNo}: {currentLesson.lessonName}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {isLessonCompleted(currentLesson) ? (
                              <div className="flex items-center text-green-600">
                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-400">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"/>
                                </svg>
                                <span className="text-sm font-medium">Not Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleLessonComplete(currentLesson.id, currentVideo.id)}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                              isLessonCompleted(currentLesson)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {isLessonCompleted(currentLesson) ? '✓ Completed' : 'Mark Complete'}
                          </button>
                          
                          {isLessonCompleted(currentLesson) && (
                            <button
                              onClick={() => handleLessonIncomplete(currentLesson.id, currentVideo.id)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                            >
                              Mark Incomplete
                            </button>
                          )}
                          
                          {currentLesson.pdf && (
                            <button
                              onClick={() => setSelectedContent('pdf')}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                            >
                              📄 Study Material
                            </button>
                          )}
                          
                          <button
                            onClick={() => window.open(currentVideo.path, '_blank')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                          >
                            🔗 Open in YouTube
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Video Available</h3>
                        <p className="text-gray-600">This lesson doesn't have a video component.</p>
                        {currentLesson?.pdf && (
                          <button
                            onClick={() => setSelectedContent('pdf')}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            📄 View Study Material Instead
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* PDF Viewer */}
              {selectedContent === 'pdf' && (
                <>
                  {currentPdf ? (
                    <div className="flex-1 flex flex-col">
                      {/* PDF Header */}
                      <div className="p-4 bg-white border-b flex-shrink-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">{currentPdf.title}</h2>
                            <p className="text-sm text-gray-600 mb-1">
                              Lesson {currentLesson.lessonNo}: {currentLesson.lessonName}
                            </p>
                            <p className="text-xs text-gray-500">Study material for this lesson</p>
                          </div>
                          {currentLesson.video && (
                            <button
                              onClick={() => setSelectedContent('video')}
                              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex-shrink-0"
                            >
                              📹 Watch Video
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* PDF Content */}
                      <div className="flex-1 p-4">
                        <PdfViewer
                          pdfUrl={currentPdf.path}
                          title={currentPdf.title}
                          height="100%"
                          showControls={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Study Material Available</h3>
                        <p className="text-gray-600">This lesson doesn't have study materials.</p>
                        {currentLesson?.video && (
                          <button
                            onClick={() => setSelectedContent('video')}
                            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                          >
                            📹 Watch Video Instead
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900">Course Lessons</h3>
              </div>
              
              {/* Lessons List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      onClick={() => switchToLesson(index)}
                      className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${
                        selectedLesson === index
                          ? 'bg-indigo-50 border-l-4 border-indigo-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded mr-2 flex-shrink-0">
                              {lesson.lessonNo}
                            </span>
                            {isLessonCompleted(lesson) && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <h5 className="font-medium text-gray-900 text-sm leading-tight mb-1 truncate">{lesson.lessonName}</h5>
                          
                          <div className="flex items-center space-x-2">
                            {lesson.video && (
                              <div className="flex items-center text-red-500">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                              </div>
                            )}
                            {lesson.pdf && (
                              <div className="flex items-center text-blue-500">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progress Summary */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Progress Summary</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{completedLessons} / {totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-medium text-indigo-600">{progress}%</span>
                  </div>
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