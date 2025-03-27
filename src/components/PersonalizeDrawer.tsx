import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { useNews } from "../context/NewsContext";
import { NewsSource } from "../types/news";

interface PersonalizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * User preferences schema for personalization
 */
interface UserPreferences {
  categories: string[];
  authorFilter: string;
  sources: string[];
}

/**
 * Available news categories for personalization
 */
const categories = [
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
 * Available news sources with display names and API values
 */
const sourceOptions = [
  { display: "NewsAPI", value: "newsapi" },
  { display: "The Guardian", value: "guardian" },
  { display: "New York Times", value: "nytimes" },
];

/**
 * Personalization drawer component that allows users to save preferences
 * for news categories, sources, and author filtering
 */
const PersonalizeDrawer: React.FC<PersonalizeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { setSelectedCategory, executeSearch } = useSearch();
  const { setSelectedSources } = useNews();

  // State for user preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    categories: [],
    authorFilter: "",
    sources: [],
  });

  // State for whether to apply changes immediately
  const [applyImmediately, setApplyImmediately] = useState(false);

  // Load saved preferences from localStorage when drawer opens
  useEffect(() => {
    if (isOpen) {
      const savedPreferences = localStorage.getItem("newsHubPreferences");
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);

        // Handle migration from old preferences format (with authors array)
        if (parsed.authors && Array.isArray(parsed.authors)) {
          parsed.authorFilter = parsed.authors[0] || "";
          delete parsed.authors;
        }

        setPreferences(parsed);
      }

      // Also check if "applyImmediately" setting exists
      const savedApplySetting = localStorage.getItem("applyImmediately");
      if (savedApplySetting) {
        setApplyImmediately(JSON.parse(savedApplySetting));
      }
    }
  }, [isOpen]);

  /**
   * Updates the author filter preference
   * Applies immediately if that setting is enabled
   */
  const handleAuthorFilterChange = (value: string) => {
    const updatedPreferences = {
      ...preferences,
      authorFilter: value,
    };

    setPreferences(updatedPreferences);

    // Apply changes immediately if the option is enabled
    if (applyImmediately) {
      applyPreferences(updatedPreferences);
    }
  };

  /**
   * Updates category or source preferences
   * Handles checkbox changes for multiple selection
   * Applies immediately if that setting is enabled
   */
  const handlePreferenceChange = (
    type: "categories" | "sources",
    value: string,
    checked: boolean
  ) => {
    const updatedPreferences = {
      ...preferences,
      [type]: checked
        ? [...preferences[type], value]
        : preferences[type].filter((item) => item !== value),
    };

    setPreferences(updatedPreferences);

    // Apply changes immediately if the option is enabled
    if (applyImmediately) {
      applyPreferences(updatedPreferences);
    }
  };

  /**
   * Applies the user preferences to the actual filters
   * Updates category, sources, and author filter
   * Triggers a search with the new preferences
   */
  const applyPreferences = (prefs: UserPreferences = preferences) => {
    // Apply category preference (if multiple, use the first one)
    if (prefs.categories.length > 0) {
      setSelectedCategory(prefs.categories[0]);
    }

    // Apply source preferences
    if (prefs.sources.length > 0) {
      // Convert display names to API source IDs
      const sourceIds: NewsSource[] = prefs.sources
        .map((displayName) => {
          const source = sourceOptions.find((s) => s.display === displayName);
          return source ? (source.value as NewsSource) : null;
        })
        .filter((id) => id !== null) as NewsSource[];

      // If sources were selected, apply them
      if (sourceIds.length > 0) {
        setSelectedSources(sourceIds);
      } else {
        // Default to all sources if none selected
        setSelectedSources(["newsapi", "guardian", "nytimes"]);
      }
    } else {
      // Default to all sources if none selected
      setSelectedSources(["newsapi", "guardian", "nytimes"]);
    }

    // Apply author filter (this will be handled by the parent component)
    document.dispatchEvent(
      new CustomEvent("authorFilterChanged", {
        detail: { authorFilter: prefs.authorFilter },
      })
    );

    // Trigger search with the new preferences
    executeSearch();
  };

  /**
   * Saves preferences to localStorage and applies them
   */
  const handleSave = () => {
    localStorage.setItem("newsHubPreferences", JSON.stringify(preferences));
    localStorage.setItem("applyImmediately", JSON.stringify(applyImmediately));

    // Apply the preferences when saving
    applyPreferences();

    onClose();
  };

  /**
   * Resets all preferences to default values
   * Clears localStorage and triggers a new search
   */
  const handleReset = () => {
    const emptyPreferences = { categories: [], authorFilter: "", sources: [] };
    setPreferences(emptyPreferences);
    localStorage.removeItem("newsHubPreferences");

    // Reset filters
    setSelectedCategory("");
    setSelectedSources(["newsapi", "guardian", "nytimes"]);

    // Reset author filter
    document.dispatchEvent(
      new CustomEvent("authorFilterChanged", {
        detail: { authorFilter: "" },
      })
    );

    // Trigger search with reset filters
    executeSearch();
  };

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
        className={`fixed right-0 top-0 h-full w-full xs:w-[90%] sm:w-[80%] md:w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Personalize Your Feed
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
            {/* News Sources */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred News Sources
              </label>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                {sourceOptions.map((source, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`source-${index}`}
                      checked={preferences.sources.includes(source.display)}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "sources",
                          source.display,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label
                      htmlFor={`source-${index}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {source.display}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Categories
              </label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${index}`}
                      checked={preferences.categories.includes(category)}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "categories",
                          category,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label
                      htmlFor={`category-${index}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Author
              </label>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Enter author name to filter..."
                  value={preferences.authorFilter}
                  onChange={(e) => handleAuthorFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter an author's name to filter articles by that author
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Appearance
              </label>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <button
                  className="p-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-150"
                  onClick={toggleTheme}
                  title={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
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
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
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
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black dark:bg-gray-900 rounded-md hover:bg-gray-900 dark:hover:bg-black focus:outline-none transition-colors duration-200"
              onClick={handleSave}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalizeDrawer;
