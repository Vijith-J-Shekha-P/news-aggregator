import React from "react";
import { NewsArticle } from "../types/news";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const timeAgo = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - publishedDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "less than a minute ago";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-150 flex flex-col h-full">
      {article.imageUrl && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {article.source.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {article.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
          {article.description}
        </p>
        <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
          {article.author && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[60%]">
              By {article.author}
            </span>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150"
          >
            Read more →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
