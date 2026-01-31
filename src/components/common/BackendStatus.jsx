import { useState, useEffect } from 'react';
import { searchService } from '../../api';

const BackendStatus = () => {
  const [status, setStatus] = useState({ checking: true, connected: false, message: '' });

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const result = await searchService.checkConnection();
        setStatus({ checking: false, ...result });
      } catch (error) {
        setStatus({
          checking: false,
          connected: false,
          message: 'Failed to check backend connection',
          suggestion: 'Please ensure the backend server is running on http://localhost:8080'
        });
      }
    };

    checkBackend();
  }, []);

  if (status.checking) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-blue-800 text-sm">Checking backend connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${
      status.connected 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {status.connected ? (
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${
            status.connected ? 'text-green-800' : 'text-red-800'
          }`}>
            Backend Status: {status.connected ? 'Connected' : 'Disconnected'}
          </p>
          <p className={`text-sm mt-1 ${
            status.connected ? 'text-green-700' : 'text-red-700'
          }`}>
            {status.message}
          </p>
          {status.suggestion && (
            <p className="text-sm mt-2 text-gray-600">
              💡 {status.suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendStatus;