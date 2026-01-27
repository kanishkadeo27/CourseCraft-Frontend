import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/course/CourseCard";

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to handle enrollment
  const handleEnrollment = (courseId) => {
    setResults(prevResults => 
      prevResults.map(course => 
        course.id === courseId 
          ? { ...course, isEnrolled: true }
          : course
      )
    );
  };

  // Reset search state when query is cleared
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsSearching(false);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false); // Don't show results section until search completes
    setResults([]); // Clear previous results

    // Simulate search with mock course results
    setTimeout(() => {
      // Check if query still matches current state (prevents stale results)
      if (query.trim()) {
        const mockResults = query.toLowerCase().includes('react') ? [
          {
            id: 1,
            courseName: "React Fundamentals",
            courseDescription: "Learn React from scratch with hands-on projects and real-world examples",
            trainer: "John Doe",
            rating: 4.5,
            price: 0, // Free for now
            duration: 30,
            imageId: 1,
            isEnrolled: false // User not enrolled in this course
          },
          {
            id: 2,
            courseName: "Advanced React Patterns",
            courseDescription: "Master advanced React concepts including hooks, context, and performance optimization",
            trainer: "Jane Smith",
            rating: 4.8,
            price: 0, // Free for now
            duration: 45,
            imageId: 1,
            isEnrolled: user?.role?.toLowerCase() === "user" ? true : false // User enrolled in this course if they're a user
          }
        ] : query.toLowerCase().includes('javascript') ? [
          {
            id: 3,
            courseName: "JavaScript Mastery",
            courseDescription: "Complete JavaScript course covering ES6+, async programming, and modern frameworks",
            trainer: "Mike Johnson",
            rating: 4.7,
            price: 0, // Free for now
            duration: 60,
            imageId: 1,
            isEnrolled: user?.role?.toLowerCase() === "user" ? true : false // User enrolled in this course if they're a user
          }
        ] : [];
        
        setResults(mockResults);
        setHasSearched(true); // Only show results after search completes
      }
      setIsSearching(false);
    }, 1000);
  };

  return (
    <section className="container mx-auto pt-2 pb-2 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Courses</h1>
          <p className="text-gray-600">Find the perfect course to advance your skills</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for courses, topics, or instructors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {(hasSearched || isSearching) && (
          <div>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-gray-600 mt-4">Searching for "{query}"...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {results.length > 0 ? `Found ${results.length} result(s) for "${query}"` : `No results found for "${query}"`}
                </h2>
                
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((course) => (
                      <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {/* Course Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`/image/courses/course${course.imageId}.jpg`}
                            alt={course.courseName}
                            className="w-full h-full object-cover"
                          />
                          {/* Price Badge */}
                          <div className="absolute top-4 right-4">
                            {course.price === 0 ? (
                              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                FREE
                              </span>
                            ) : (
                              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ₹{course.price}
                              </span>
                            )}
                          </div>
                          {/* Instructor Avatar */}
                          <div className="absolute bottom-4 left-4">
                            <img
                              src={`/image/teachers/author${course.imageId}.jpg`}
                              alt={course.trainer}
                              className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                            />
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {course.courseName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {course.courseDescription}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    course.rating >= star ? 'fill-current' : 'fill-gray-300'
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-gray-600 text-sm ml-2">{course.rating}</span>
                          </div>

                          {/* Course Meta */}
                          <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              2.4k Enrolled
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {course.duration} Days
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 space-y-2">
                            {/* View Details Button - Always visible */}
                            <button 
                              onClick={() => navigate(`/courses/${course.id}`)}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200 border border-gray-300"
                            >
                              View Details
                            </button>

                            {/* Role-based Action Button */}
                            {!user && (
                              <button 
                                onClick={() => navigate('/login')}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                              >
                                Register Now
                              </button>
                            )}
                            {user?.role?.toLowerCase() === "admin" && (
                              <button 
                                onClick={() => navigate(`/admin/courses/manage/${course.id}`)}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                              >
                                Manage Course
                              </button>
                            )}
                            {user?.role?.toLowerCase() === "user" && (
                              <>
                                {course.isEnrolled ? (
                                  <button 
                                    onClick={() => navigate(`/courses/${course.id}/classroom`)}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                  >
                                    Go to Classroom
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleEnrollment(course.id)}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                  >
                                    Register Now
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Try searching for "react" or "javascript" to see sample results</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Popular Searches */}
        {!hasSearched && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "JavaScript", "Python", "Web Development", "Data Science"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Search;
