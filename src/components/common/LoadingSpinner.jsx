const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]} mb-4`}></div>
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>{text}</p>
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]} mb-2`}></div>
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className={`inline-block animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]} mb-2`}></div>
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;