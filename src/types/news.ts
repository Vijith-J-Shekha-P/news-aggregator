export interface NewsArticle {
  id: string;
  source: {
    id: string;
    name: string;
  };
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  author?: string;
}

export interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NYTArticle {
  uri: string;
  title: string;
  abstract: string;
  url: string;
  multimedia: Array<{
    url: string;
    type: string;
  }>;
  published_date: string;
  byline: string;
}

export interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
    bodyText?: string;
    trailText?: string;
    byline?: string;
  };
}

export interface GuardianCategory {
  id: string;
  webTitle: string;
  webUrl: string;
}

export interface NYTCategory {
  section: string;
  display_name: string;
}

export interface NewsFilters {
  searchQuery?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
  author?: string;
}

export type NewsSource = 'newsapi' | 'guardian' | 'nytimes';