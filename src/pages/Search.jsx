import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/course/CourseCard";

const Search = () => {
  const { user, getUserRole } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const userRole = getUserRole();

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
            isEnrolled: userRole === "user" ? true : false
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
            isEnrolled: false // User not enrolled in this course
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
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        user={user}
                      />
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
