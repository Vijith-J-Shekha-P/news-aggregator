import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: {
    fromDate: string;
    toDate: string;
  };
  setDateRange: (range: { fromDate: string; toDate: string }) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  executeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = () => {
    // Allow search even without a query to support filtering by category/date
    setIsSearching(true);

    // Debugging log to check filter values
    console.log("Executing search with:", {
      query: searchQuery,
      category: selectedCategory,
      dateRange,
    });
  };

  const value = {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    selectedCategory,
    setSelectedCategory,
    isSearching,
    setIsSearching,
    executeSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
