import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { courseService } from '../../api';
import PdfViewer from '../../components/common/PdfViewer';

const PdfViewerPage = () => {
  const { id, pdfId } = useParams(); // Course ID and PDF ID
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndPdf = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseContent(id);
        
        // Map API response to component expectations
        const mappedCourse = {
          id: parseInt(id),
          courseName: data.title,
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
        
        // Find the specific PDF
        const pdf = mappedCourse.pdfs.find(p => p.id === parseInt(pdfId));
        if (pdf) {
          setPdfData(pdf);
        } else {
          setError("PDF document not found");
        }
        
      } catch (err) {
        setError(err.message || "Failed to load document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id && pdfId) {
      fetchCourseAndPdf();
    }
  }, [id, pdfId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-2 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Document Not Found</h3>
            <p className="text-gray-600 mb-4">{error || "The requested PDF document could not be found."}</p>
          </div>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-4"
          >
            Back to Course
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/courses/${id}`)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {course?.courseName}
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{pdfData.title}</h1>
              {pdfData.description && (
                <p className="text-gray-600 mt-2">{pdfData.description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Study Material
              </span>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <PdfViewer
            pdfUrl={pdfData.url}
            title={pdfData.title}
            height="calc(100vh - 200px)"
            showControls={true}
          />
        </div>

        {/* Related Documents */}
        {course?.pdfs && course.pdfs.length > 1 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Study Materials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.pdfs
                .filter(pdf => pdf.id !== pdfData.id)
                .map((pdf) => (
                  <div
                    key={pdf.id}
                    onClick={() => navigate(`/courses/${id}/pdf/${pdf.id}`)}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {pdf.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {pdf.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewerPage;