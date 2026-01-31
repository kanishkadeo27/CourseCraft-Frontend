import { useState, useEffect } from 'react';

const PdfViewer = ({ 
  pdfUrl, 
  title = "Document", 
  height = "600px",
  showControls = true,
  onLoadSuccess = null,
  onLoadError = null 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [pdfUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoadSuccess) onLoadSuccess();
  };

  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF document");
    if (onLoadError) onLoadError();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Unable to Load PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={openInNewTab}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* PDF Controls */}
      {showControls && (
        <div className="bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-700">{title}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadPdf}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download PDF"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            <button
              onClick={openInNewTab}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title="Open in New Tab"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
            
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        </div>
      )}

      {/* PDF Embed */}
      <div className={`relative ${isLoading ? 'hidden' : 'block'}`}>
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
          width="100%"
          height={isFullscreen ? 'calc(100vh - 60px)' : height}
          title={title}
          onLoad={handleLoad}
          onError={handleError}
          className="border-0"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Fallback for browsers that don't support PDF embedding */}
      <noscript>
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            Your browser doesn't support PDF viewing. Please download the file to view it.
          </p>
          <button
            onClick={downloadPdf}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </noscript>
    </div>
  );
};

export default PdfViewer;