import React, { createContext, useContext, useState } from "react";
import { NewsFilters, NewsSource } from "../types/news";

interface NewsContextType {
  filters: NewsFilters;
  setFilters: (filters: NewsFilters) => void;
  selectedSources: NewsSource[];
  setSelectedSources: (sources: NewsSource[]) => void;
  preferredCategories: string[];
  setPreferredCategories: (categories: string[]) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<NewsFilters>({});
  const [selectedSources, setSelectedSources] = useState<NewsSource[]>([
    "newsapi",
    "guardian",
    "nytimes",
  ]);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);

  const value = {
    filters,
    setFilters,
    selectedSources,
    setSelectedSources,
    preferredCategories,
    setPreferredCategories,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
