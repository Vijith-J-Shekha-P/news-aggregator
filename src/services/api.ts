import axios from 'axios';
import type { NewsArticle, NewsApiArticle, NYTArticle, GuardianArticle, GuardianCategory, NYTCategory } from '../types/news';

// API keys from environment variables
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NYT_API_KEY = import.meta.env.VITE_NY_TIMES_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;

// Initialize NewsAPI client with API key in header
const newsApiClient = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    Authorization: NEWS_API_KEY,
  },
});

// Initialize New York Times API client
const nytClient = axios.create({
  baseURL: 'https://api.nytimes.com/svc/news/v3',
});

// Initialize The Guardian API client
const guardianClient = axios.create({
  baseURL: 'https://content.guardianapis.com',
});

// Default image when articles don't have one
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/400x200?text=No+Image+Available';

/**
 * Fetches available categories from The Guardian API
 * Used for populating category filters
 */
export const fetchGuardianCategories = async (): Promise<GuardianCategory[]> => {
  const response = await guardianClient.get<{ response: { results: GuardianCategory[] } }>('/sections', {
    params: {
      'api-key': GUARDIAN_API_KEY,
    },
  });
  return response.data.response.results;
};

/**
 * Fetches available categories from New York Times API
 * Used for populating category filters
 */
export const fetchNYTCategories = async (): Promise<NYTCategory[]> => {
  const response = await nytClient.get<{ results: NYTCategory[] }>('/content/section-list.json', {
    params: {
      'api-key': NYT_API_KEY,
    },
  });
  return response.data.results;
};

/**
 * Fetches articles from NewsAPI (sources like BBC, CNN, etc.)
 * Supports search, category filtering, date range, and author filtering
 * Uses different endpoints based on query presence
 * 
 * @param query - Optional search query
 * @param category - Optional category filter
 * @param from - Optional start date
 * @param to - Optional end date
 * @param author - Optional author filter
 * @returns Normalized array of news articles
 */
export const fetchNewsApiArticles = async (
  query?: string,
  category?: string,
  from?: string,
  to?: string,
  author?: string
): Promise<NewsArticle[]> => {
  const params: Record<string, string> = {};

  // Add filters to params if provided
  if (query) params.q = query;
  if (category) params.category = category;
  if (from) params.from = from;
  if (to) params.to = to;
  if (author) params.author = author;

  // /everything for search queries, /top-headlines for categories or default
  const endpoint = query ? '/everything' : '/top-headlines';

  // Add country=us only for /top-headlines (default or category selection)
  if (!query && endpoint === '/top-headlines') {
    params.country = 'us';
  }

  const response = await newsApiClient.get<{ articles: NewsApiArticle[] }>(endpoint, {
    params: {
      ...params,
      pageSize: 20,
    },
  });

  // Normalize articles to common format
  return response.data.articles.map((article) => ({
    id: article.url,
    source: { id: article.source.id || 'unknown', name: article.source.name },
    title: article.title,
    description: article.description,
    url: article.url,
    imageUrl: article.urlToImage || DEFAULT_IMAGE_URL,
    publishedAt: article.publishedAt,
    author: article.author || undefined,
  }));
};

/**
 * NYT article search response type definition
 */
interface NYTSearchResponse {
  response: {
    docs: Array<{
      uri: string;
      title: string;
      abstract: string;
      url: string;
      multimedia: Array<{ url: string }>;
      published_date: string;
      byline: string;
    }>;
  };
}

/**
 * Fetches articles from the New York Times API
 * Can fetch by section or by search query
 * 
 * @param section - Section to fetch (default: 'all')
 * @param searchQuery - Optional search query
 * @param fromDate - Optional start date
 * @param toDate - Optional end date
 * @returns Normalized array of news articles
 */
export const fetchNYTArticles = async (
  section = 'all',
  searchQuery?: string,
  fromDate?: string,
  toDate?: string
): Promise<NewsArticle[]> => {
  // Different endpoints based on whether we're searching or browsing by section
  const endpoint = searchQuery ? '/search/v2/articlesearch.json' : `/content/all/${section}.json`;
  
  const params: Record<string, string> = {
    'api-key': NYT_API_KEY,
  };

  // Add filters to params if provided
  if (searchQuery) {
    params.q = searchQuery;
  }
  if (fromDate) {
    params.begin_date = fromDate.replace(/-/g, '');
  }
  if (toDate) {
    params.end_date = toDate.replace(/-/g, '');
  }

  const response = await nytClient.get<NYTSearchResponse | { results: NYTArticle[] }>(endpoint, { params });

  // Handle different response structures based on endpoint
  const articles = searchQuery 
    ? (response.data as NYTSearchResponse).response.docs 
    : (response.data as { results: NYTArticle[] }).results;

  // Normalize to common article format
  return articles
    .filter((article) => article.title && article.abstract)
    .map((article) => ({
      id: article.uri,
      source: { id: 'nyt', name: 'New York Times' },
      title: article.title,
      description: article.abstract,
      url: article.url,
      imageUrl: article.multimedia?.[0]?.url || DEFAULT_IMAGE_URL,
      publishedAt: article.published_date,
      author: article.byline?.replace(/^By /, '') || undefined,
    }));
};

/**
 * Fetches articles from The Guardian API
 * Supports search, section filtering, date range, and author filtering
 * 
 * @param query - Optional search query
 * @param section - Optional section filter
 * @param from - Optional start date
 * @param to - Optional end date
 * @param author - Optional author filter
 * @returns Normalized array of news articles
 */
export const fetchGuardianArticles = async (
  query?: string,
  section?: string,
  from?: string,
  to?: string,
  author?: string
): Promise<NewsArticle[]> => {
  const params: Record<string, string> = {
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'thumbnail',
  };

  // Add filters to params if provided
  if (query) params.q = query;
  if (section) params.section = section;
  if (from) params['from-date'] = from;
  if (to) params['to-date'] = to;
  if (author) params['author'] = author;

  const response = await guardianClient.get<{ response: { results: GuardianArticle[] } }>('/search', { params });

  // Normalize to common article format
  return response.data.response.results.map((article) => ({
    id: article.id,
    source: { id: 'guardian', name: 'The Guardian' },
    title: article.webTitle,
    description: '',
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail || DEFAULT_IMAGE_URL,
    publishedAt: article.webPublicationDate,
  }));
}; 