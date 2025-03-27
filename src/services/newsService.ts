import { NewsArticle, NewsSource, NewsFilters } from '../types/news';
import { fetchNewsApiArticles } from './api';
import { fetchGuardianArticles } from './api';
import { fetchNYTArticles } from './api';

/**
 * Searches for news articles across multiple sources with filters
 * 
 * @param sources - Array of news sources to fetch from (NewsAPI, Guardian, NYT)
 * @param filters - Object containing search filters (query, category, dates, author)
 * @returns Promise resolving to array of normalized NewsArticle objects
 */
export const searchAllNews = async (
  sources: NewsSource[],
  filters: NewsFilters
): Promise<NewsArticle[]> => {
  try {
    const searchPromises = sources.map(async (source) => {
      try {
        // Skip NY Times API if there's a search query
        // (NYT search requires different endpoint with separate implementation)
        if (source === 'nytimes' && filters.searchQuery) {
          return [];
        }

        // Call appropriate API based on selected source
        switch (source) {
          case 'guardian':
            return await fetchGuardianArticles(
              filters.searchQuery,
              filters.category,
              filters.fromDate,
              filters.toDate,
              filters.author
            );
          case 'nytimes':
            return await fetchNYTArticles(filters.category || 'all');
          case 'newsapi':
            return await fetchNewsApiArticles(
              filters.searchQuery,
              filters.category,
              filters.fromDate,
              filters.toDate,
              filters.author
            );
          default:
            return [];
        }
      } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
        return [];
      }
    });

    // Wait for all API requests to complete
    const results = await Promise.all(searchPromises);
    const allArticles = results.flat();

    // Sort articles by date (newest first)
    return allArticles.sort((a: NewsArticle, b: NewsArticle) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error in searchAllNews:', error);
    throw error;
  }
};

/**
 * Gets top headlines from multiple sources, optionally filtered by category
 * 
 * @param sources - Array of news sources to fetch from
 * @param category - Optional category to filter headlines
 * @returns Promise resolving to array of normalized NewsArticle objects
 */
export const getTopHeadlines = async (
  sources: NewsSource[],
  category?: string
): Promise<NewsArticle[]> => {
  try {
    const searchPromises = sources.map(async (source) => {
      try {
        // Call appropriate API based on selected source
        switch (source) {
          case 'guardian':
            return await fetchGuardianArticles(undefined, category);
          case 'nytimes':
            return await fetchNYTArticles(category || 'all');
          case 'newsapi':
            return await fetchNewsApiArticles(undefined, category);
          default:
            return [];
        }
      } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
        return [];
      }
    });

    // Wait for all API requests to complete
    const results = await Promise.all(searchPromises);
    const allArticles = results.flat();

    // Sort articles by date (newest first)
    return allArticles.sort((a: NewsArticle, b: NewsArticle) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error in getTopHeadlines:', error);
    throw error;
  }
}; 