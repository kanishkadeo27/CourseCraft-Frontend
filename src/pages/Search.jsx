import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchService } from "../api";
import CourseCard from "../components/course/CourseCard";

const Search = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || "");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const userRole = getUserRole();

  // Redirect admin users to dashboard
  useEffect(() => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
      return;
    }
  }, [userRole, navigate]);

  // Perform search if there's a query parameter on page load
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery);
      // Don't auto-search, just set the query
    }
  }, [searchParams]);

  // Reset search state when query is cleared
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsSearching(false);
      // Clear URL parameter when query is empty
      if (searchParams.get('q')) {
        setSearchParams({});
      }
    }
  }, [query, searchParams, setSearchParams]);

  // Don't render anything for admin users (they'll be redirected)
  if (userRole === "admin") {
    return null;
  }

  // Perform search function (can be called from form submit or URL parameter)
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    setResults([]);

    try {
      const data = await searchService.searchCourses(searchQuery.trim());
      
      // Handle different possible response structures
      const courses = data.data;
      
      // Map the response to match our CourseCard component expectations
      const mappedResults = courses.map(course => {
        // Skip courses without syllabus data
        if (!course.syllabus || !course.syllabus.lessons) {
          return {
            id: course.id,
            courseName: course.title,
            courseDescription: course.description,
            trainer: course.trainer.name,
            trainerImage: course.trainer.imageUrl,
            rating: course.trainer.rating,
            price: course.price,
            duration: 0,
            imageId: course.thumbnailUrl,
            isEnrolled: course.enrolled,
            totalVideos: 0,
            level: course.level,
            mode: course.mode,
            language: course.language,
            topics: course.topics,
            category: course.topics[0],
            subcategory: course.topics[1],
            currentEnrollment: course.enrollments
          };
        }

        return {
          id: course.id,
          courseName: course.title,
          courseDescription: course.description,
          trainer: course.trainer.name,
          trainerImage: course.trainer.imageUrl,
          rating: course.trainer.rating,
          price: course.price,
          duration: course.syllabus.lessons.filter((lesson, index, self) => 
            index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
          ).length,
          imageId: course.thumbnailUrl,
          isEnrolled: course.enrolled,
          totalVideos: course.syllabus.lessons.filter((lesson, index, self) => 
            index === self.findIndex(l => l.lessonNo === lesson.lessonNo)
          ).reduce((total, lesson) => 
            total + (lesson.materials.filter(m => m.type === 'VIDEO').length), 0),
          level: course.level,
          mode: course.mode,
          language: course.language,
          topics: course.topics,
          category: course.topics[0],
          subcategory: course.topics[1],
          currentEnrollment: course.enrollments
        };
      });

      setResults(mappedResults);
      setHasSearched(true);
    } catch (error) {
      // Handle search errors gracefully
      setResults([]);
      setHasSearched(true);
      
      // Show user-friendly error message
      setError(error.message || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL with search query
    setSearchParams({ q: query.trim() });
    
    // Perform the search
    await performSearch(query);
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
                    <p className="text-gray-500">No courses found matching your search criteria.</p>
                    <p className="text-gray-400 text-sm mt-2">Try different keywords or browse our course catalog.</p>
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
              {["React", "JavaScript", "Python", "Java", "Web Development", "Data Science", "Machine Learning", "DevOps", "Node.js", "Spring Boot"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setSearchParams({ q: term });
                    performSearch(term);
                  }}
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
