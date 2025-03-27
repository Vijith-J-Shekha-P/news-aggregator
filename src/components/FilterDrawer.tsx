import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { useNews } from "../context/NewsContext";
import { NewsSource } from "../types/news";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Available news categories for filtering
 */
const categories = [
  "All Categories",
  "Technology",
  "Politics",
  "Business",
  "Science",
  "Health",
  "Sports",
  "Entertainment",
  "World News",
];

/**
 * Filter drawer component that allows users to filter news articles
 * by date range, category, and source
 */
const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose }) => {
  // Get search context values and methods
  const {
    dateRange,
    setDateRange,
    selectedCategory,
    setSelectedCategory,
    executeSearch,
  } = useSearch();

  // Get news context values and methods
  const { selectedSources, setSelectedSources } = useNews();

  // Local state for form values (to avoid updating global state on every change)
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [localCategory, setLocalCategory] = useState(selectedCategory || "");
  const [localSources, setLocalSources] = useState<string[]>(
    selectedSources.length === 0 ||
      (selectedSources.includes("newsapi") &&
        selectedSources.includes("guardian") &&
        selectedSources.includes("nytimes"))
      ? ["All Sources"]
      : selectedSources.map((source) => {
          switch (source) {
            case "newsapi":
              return "BBC";
            case "guardian":
              return "The Guardian";
            case "nytimes":
              return "New York Times";
            default:
              return "";
          }
        })
  );

  // Update local state when props change
  useEffect(() => {
    setLocalDateRange(dateRange);
    setLocalCategory(selectedCategory || "");

    // If all sources are selected or none, set to "All Sources"
    if (
      selectedSources.length === 0 ||
      (selectedSources.includes("newsapi") &&
        selectedSources.includes("guardian") &&
        selectedSources.includes("nytimes"))
    ) {
      setLocalSources(["All Sources"]);
    } else {
      // Map API sources to display names
      setLocalSources(
        selectedSources.map((source) => {
          switch (source) {
            case "newsapi":
              return "BBC";
            case "guardian":
              return "The Guardian";
            case "nytimes":
              return "New York Times";
            default:
              return "";
          }
        })
      );
    }
  }, [dateRange, selectedCategory, selectedSources]);

  // Debug function to log state changes
  useEffect(() => {
    console.log("FilterDrawer - Current Category:", selectedCategory);
  }, [selectedCategory]);

  /**
   * Applies the selected filters and updates global state
   * Only updates if there are actual changes to avoid unnecessary rerenders
   */
  const handleApplyFilters = () => {
    // Prepare the new filters
    const newCategory = localCategory;
    const newDateRange = {
      fromDate: localDateRange.fromDate,
      toDate: localDateRange.toDate,
    };

    // Convert source names to API source IDs
    let newSelectedSources: NewsSource[];

    if (localSources.includes("All Sources")) {
      // If "All Sources" is selected, include all available sources
      newSelectedSources = ["newsapi", "guardian", "nytimes"];
    } else {
      // If individual sources are selected, map them to API source IDs
      newSelectedSources = localSources.map((source) => {
        switch (source) {
          case "New York Times":
            return "nytimes";
          case "The Guardian":
            return "guardian";
          case "BBC":
            return "newsapi";
          // Handle other sources that might be in the dropdown but not mapped
          case "Reuters":
          case "Associated Press":
            return "newsapi"; // Default to newsapi for now
          default:
            return "newsapi";
        }
      });
    }

    // Check if there are any actual changes
    const hasCategoryChange = newCategory !== selectedCategory;
    const hasDateChange =
      newDateRange.fromDate !== dateRange.fromDate ||
      newDateRange.toDate !== dateRange.toDate;
    const hasSourceChange =
      newSelectedSources.length !== selectedSources.length ||
      !newSelectedSources.every((source) => selectedSources.includes(source)) ||
      !selectedSources.every((source) => newSelectedSources.includes(source));

    console.log("Apply Filters - Category Change:", {
      newCategory,
      selectedCategory,
      hasCategoryChange,
    });

    // Only update state and trigger search if there are actual changes
    if (hasCategoryChange || hasDateChange || hasSourceChange) {
      // Update all filters in context
      setSelectedCategory(newCategory);
      setDateRange(newDateRange);
      setSelectedSources(newSelectedSources);

      // Execute search with all combined filters
      executeSearch();
    }

    onClose();
  };

  /**
   * Resets all filters to their default values
   */
  const handleClearFilters = () => {
    // Reset local state
    setLocalDateRange({ fromDate: "", toDate: "" });
    setLocalCategory("");
    setLocalSources(["All Sources"]);

    // Reset global state
    setSelectedSources(["newsapi", "guardian", "nytimes"]);
    setDateRange({ fromDate: "", toDate: "" });
    setSelectedCategory("");

    // Trigger search with cleared filters
    executeSearch();
    onClose();
  };

  // Update initial state when component mounts
  useEffect(() => {
    if (selectedSources.length === 0) {
      setSelectedSources(["newsapi", "guardian", "nytimes"]);
      setLocalSources(["All Sources"]);
    }
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full xs:w-[85%] sm:w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-150 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Filter Articles
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-4">
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={localCategory}
                  onChange={(e) => {
                    console.log("Category selected:", e.target.value);
                    setLocalCategory(e.target.value);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-150"
                >
                  {categories.map((category, index) => (
                    <option
                      key={index}
                      value={category === "All Categories" ? "" : category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sources Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sources
              </label>
              <div className="relative">
                <select
                  value={
                    localSources.includes("All Sources")
                      ? "All Sources"
                      : localSources.join(",")
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "All Sources") {
                      setLocalSources(["All Sources"]);
                    } else {
                      setLocalSources(value.split(","));
                    }
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-150"
                >
                  <option value="All Sources">All Sources</option>
                  <option value="New York Times">New York Times</option>
                  <option value="The Guardian">The Guardian</option>
                  <option value="BBC">BBC</option>
                </select>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                    From:
                  </span>
                  <input
                    type="date"
                    value={localDateRange.fromDate}
                    onChange={(e) =>
                      setLocalDateRange({
                        ...localDateRange,
                        fromDate: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-150"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                    To:
                  </span>
                  <input
                    type="date"
                    value={localDateRange.toDate}
                    onChange={(e) =>
                      setLocalDateRange({
                        ...localDateRange,
                        toDate: e.target.value,
                      })
                    }
                    min={localDateRange.fromDate}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-150"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black dark:bg-gray-900 rounded-md hover:bg-gray-900 dark:hover:bg-black focus:outline-none transition-colors duration-150"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
