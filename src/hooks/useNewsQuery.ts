import { useQuery } from '@tanstack/react-query';
import { NewsSource, NewsFilters } from '../types/news';
import { searchAllNews, getTopHeadlines } from '../services/newsService';

export const useMultiSourceNews = (
  sources: NewsSource[],
  filters: NewsFilters = {}
) => {
  const { searchQuery, fromDate, toDate } = filters;
  const isSearching = Boolean(searchQuery || fromDate || toDate);

  return useQuery({
    queryKey: ['news', sources, filters],
    queryFn: async () => {
      if (isSearching) {
        return searchAllNews(sources, filters);
      }
      return getTopHeadlines(sources, filters.category);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCombinedNews = (
  sources: NewsSource[],
  filters: NewsFilters = {}
) => {
  const { data: articles = [], isLoading, isError, error } = useMultiSourceNews(sources, filters);

  // Track which sources failed
  const failedSources = sources.filter(source => {
    const sourceArticles = articles.filter(article => article.source.id === source);
    return sourceArticles.length === 0;
  });

  // Determine if we have partial data
  const hasPartialData = articles.length > 0 && failedSources.length < sources.length;

  return {
    articles,
    isLoading,
    isError,
    error,
    failedSources,
    hasPartialData,
  };
}; 