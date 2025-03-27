import React, { KeyboardEvent } from "react";
import { useSearch } from "../context/SearchContext";

/**
 * Search bar component for article search
 * Allows users to enter keywords to search across all news sources
 * Searches are executed on Enter key press or clicking the search button
 */
const SearchBar: React.FC = () => {
  // Get search context values and methods
  const { searchQuery, setSearchQuery, executeSearch } = useSearch();

  /**
   * Handle Enter key press to trigger search
   */
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          {/* Search input with real-time query update */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search articles..."
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-150"
          />
          {/* Search button inside input */}
          <button
            onClick={executeSearch}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-150"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Uncomment if you want a separate search button
        <button
          onClick={executeSearch}
          className="hidden sm:block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-150"
        >
          Search
        </button> */}
      </div>
    </div>
  );
};

export default SearchBar;
