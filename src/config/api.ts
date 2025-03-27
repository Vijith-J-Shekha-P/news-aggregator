
// Verify API keys are loaded
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const NY_TIMES_API_KEY = import.meta.env.VITE_NY_TIMES_API_KEY;

// Log if any API keys are missing
if (!NEWS_API_KEY || !GUARDIAN_API_KEY || !NY_TIMES_API_KEY) {
  console.error('Missing API keys:', {
    newsApi: !NEWS_API_KEY,
    guardian: !GUARDIAN_API_KEY,
    nyTimes: !NY_TIMES_API_KEY,
  });
}

export const API_CONFIG = {
  NEWS_API: {
    BASE_URL: 'https://newsapi.org/v2',
    API_KEY: NEWS_API_KEY,
    ENDPOINTS: {
      TOP_HEADLINES: '/top-headlines',
      EVERYTHING: '/everything',
    },
  },
  GUARDIAN_API: {
    BASE_URL: 'https://content.guardianapis.com',
    API_KEY: GUARDIAN_API_KEY,
    ENDPOINTS: {
      SEARCH: '/search',
    },
  },
  NY_TIMES_API: {
    BASE_URL: 'https://api.nytimes.com/svc/search/v2',
    API_KEY: NY_TIMES_API_KEY,
    ENDPOINTS: {
      SEARCH: '/articlesearch.json',
    },
  },
};

export const NEWS_CATEGORIES = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports',
  'politics',
  'world',
] as const;

export const DEFAULT_PAGE_SIZE = 10; 