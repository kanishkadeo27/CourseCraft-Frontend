import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  // Store progress data: { courseId: { videoId: completed, videoId2: completed, ... } }
  const [courseProgress, setCourseProgress] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('courseProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
  }, [courseProgress]);

  // Mark a video as completed
  const markVideoCompleted = (courseId, videoId) => {
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [videoId]: true
      }
    }));
  };

  // Mark a video as incomplete
  const markVideoIncomplete = (courseId, videoId) => {
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [videoId]: false
      }
    }));
  };

  // Check if a video is completed
  const isVideoCompleted = (courseId, videoId) => {
    return courseProgress[courseId]?.[videoId] || false;
  };

  // Calculate course progress percentage
  const getCourseProgress = (courseId, totalVideos) => {
    const courseData = courseProgress[courseId] || {};
    const completedVideos = Object.values(courseData).filter(completed => completed).length;
    return totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  };

  // Get completed video count
  const getCompletedVideoCount = (courseId) => {
    const courseData = courseProgress[courseId] || {};
    return Object.values(courseData).filter(completed => completed).length;
  };

  const value = {
    courseProgress,
    markVideoCompleted,
    markVideoIncomplete,
    isVideoCompleted,
    getCourseProgress,
    getCompletedVideoCount
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};