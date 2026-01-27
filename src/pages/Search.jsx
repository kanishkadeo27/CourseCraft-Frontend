import { useState } from "react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search with mock results
    setTimeout(() => {
      const mockResults = query.toLowerCase().includes('react') ? [
        { id: 1, title: "React Fundamentals", type: "Course", description: "Learn React from scratch" },
        { id: 2, title: "Advanced React Patterns", type: "Course", description: "Master advanced React concepts" }
      ] : [];
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <section className="container mx-auto pt-24 px-6">
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
        {hasSearched && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {results.length > 0 ? `Found ${results.length} result(s) for "${query}"` : `No results found for "${query}"`}
            </h2>
            
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded mt-1">
                          {result.type}
                        </span>
                        <p className="text-gray-600 mt-2">{result.description}</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Try searching for "react" to see sample results</p>
              </div>
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
