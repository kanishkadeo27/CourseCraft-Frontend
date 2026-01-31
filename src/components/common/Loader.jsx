const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        
        {/* Loading Message */}
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loader;