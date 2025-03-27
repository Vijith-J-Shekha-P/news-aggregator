import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import NewsCard from "./components/NewsCard";
import { ThemeProvider } from "./context/ThemeContext";
import { NewsProvider } from "./context/NewsContext";
import { SearchProvider } from "./context/SearchContext";
import { useNews } from "./context/NewsContext";
import { useSearch } from "./context/SearchContext";
import { useCombinedNews } from "./hooks/useNewsQuery";
import { NewsSource } from "./types/news";

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Error banner component that displays failed news sources
 * Auto-hides after 3 seconds
 */
const ErrorBanner: React.FC<{ failedSources: NewsSource[] }> = ({
  failedSources,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-opacity duration-500 ease-in-out opacity-100">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Failed to load news from: {failedSources.join(", ")}
          </h3>
        </div>
      </div>
    </div>
  );
};

/**
 * Main news feed component that displays articles
 * Handles:
 * - Filtering by search, date, and category
 * - Loading states
 * - Error handling
 * - Empty states
 */
const NewsFeed: React.FC = () => {
  const { selectedSources, setFilters } = useNews();
  const { searchQuery, dateRange, selectedCategory, isSearching } = useSearch();

  // Update filters in NewsContext when search state changes
  React.useEffect(() => {
    if (isSearching) {
      setFilters({
        searchQuery: searchQuery.trim(),
        category: selectedCategory,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      });
    } else {
      setFilters({});
    }
  }, [isSearching, searchQuery, selectedCategory, dateRange, setFilters]);

  // Custom hook that fetches and combines news from multiple sources
  const { articles, isLoading, isError, failedSources, hasPartialData } =
    useCombinedNews(
      selectedSources,
      isSearching
        ? {
            searchQuery: searchQuery.trim(),
            category: selectedCategory,
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
          }
        : {}
    );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state (all sources failed)
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-900 dark:text-gray-100">
        <svg
          className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Failed to Load News</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          We couldn't fetch news from any sources. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Show error banner if some sources failed but others succeeded */}
      {hasPartialData && failedSources.length > 0 && (
        <ErrorBanner failedSources={failedSources} />
      )}

      {/* Responsive grid of news articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full transition-all duration-150">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {isSearching
              ? "No articles found matching your search criteria."
              : "No articles available."}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Main application component that sets up:
 * - React Query for data fetching
 * - Theme provider for dark/light mode
 * - News context for article state
 * - Search context for filter state
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NewsProvider>
          <SearchProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-150 w-[100vw]">
              <Header />
              <main className="max-w-7xl w-full mx-auto py-4 sm:py-6 px-3 sm:px-4 transition-all duration-150">
                <NewsFeed />
              </main>
            </div>
          </SearchProvider>
        </NewsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
