# News Aggregator

A modern news aggregator application built with React, TypeScript, and Vite. This application fetches news from multiple sources including NewsAPI, The Guardian, and The New York Times.

## Features

### Multi-Source News Integration

- Real-time news integration from NewsAPI, The Guardian, and The New York Times APIs
- Normalized article format across all sources for consistent display
- Error handling for failed API requests with partial data display capabilities

### Search and Filtering

- Real-time keyword search across all news sources
- Category-based filtering (Technology, Politics, Business, etc.)
- Date range filtering with from/to date selection
- Source filtering to view news from specific providers
- Responsive filter drawer for mobile and desktop interfaces

### Personalization

- Customizable news feed based on preferred categories
- Save source preferences to localStorage for persistence
- Author filtering for following specific journalists
- Dark/Light theme support with preference storage

### User Experience

- Clean, modern UI with responsive design
- Mobile-first approach with adaptive layouts
- Loading states and error handling
- Empty state messaging
- Accessible UI components

## Prerequisites

- Node.js 18 or higher
- Docker (optional, for containerized deployment)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_NEWS_API_KEY=your_newsapi_key
VITE_NY_TIMES_API_KEY=your_nytimes_key
VITE_GUARDIAN_API_KEY=your_guardian_key
```

You'll need to register for API keys at:

- [NewsAPI](https://newsapi.org/)
- [New York Times API](https://developer.nytimes.com/)
- [The Guardian API](https://open-platform.theguardian.com/)

## Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Docker Deployment

### Option 1: Using Docker Compose

1. Make sure Docker and Docker Compose are installed on your system.

2. Run the application with docker-compose:

```bash
docker-compose up -d
```

3. To stop the application:

```bash
docker-compose down
```

### Option 2: Using Docker directly

1. Build the Docker image:

```bash
docker build -t news-aggregator .
```

2. Run the container:

```bash
docker run -p 80:80 news-aggregator
```

The application will be available at `http://localhost:80`

### Note on Environment Variables

When using Docker, the environment variables from your `.env` file are baked into the application during the build process. If you need to change these values, you'll need to rebuild the Docker image.

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # React components
│   ├── FilterDrawer.tsx    # Article filtering UI
│   ├── Header.tsx          # App header with search and filters
│   ├── NewsCard.tsx        # Article card component
│   ├── PersonalizeDrawer.tsx # Personalization UI
│   └── SearchBar.tsx       # Search input component
├── config/         # Configuration files
├── context/        # React context providers
│   ├── NewsContext.tsx     # News source/article state
│   ├── SearchContext.tsx   # Search and filter state
│   └── ThemeContext.tsx    # Dark/light theme state
├── hooks/          # Custom React hooks
│   └── useNewsQuery.ts     # Data fetching hook
├── services/       # API services
│   ├── api.ts              # API integration for all sources
│   └── newsService.ts      # Unified news service
└── types/          # TypeScript type definitions
    └── news.ts             # News article and filter types
```

## Implementation Details

### Article Search and Filtering

The application allows users to search for articles by keyword across all integrated news sources. The search function performs real-time queries against the APIs and displays the results in a unified format.

Filtering capabilities include:

- Category filtering through a dropdown menu
- Date range filtering with date pickers
- Source filtering to view news from specific providers
- Results are sorted by publication date

### Personalized News Feed

Users can customize their news feed by:

- Selecting preferred news sources (NewsAPI, The Guardian, New York Times)
- Saving category preferences
- Setting author filters to follow specific journalists
- All preferences are saved to localStorage for persistence between sessions

### Mobile-Responsive Design

The application is fully responsive:

- Adapts to mobile, tablet, and desktop screen sizes
- Responsive grid layout for news articles
- Mobile navigation and filter drawers
- Touch-friendly UI components

## Technologies Used

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query for data fetching with caching
- Axios for API requests
- Docker for containerization

## Best Practices Implemented

This project follows several software development best practices:

### DRY (Don't Repeat Yourself)

- Reusable components like NewsCard for displaying articles
- Common API service functions in api.ts
- Unified search function in newsService.ts
- Shared types and interfaces

### KISS (Keep It Simple, Stupid)

- Clean and straightforward component architecture
- Intuitive UI with clear user flows
- Minimal state management with React Context API
- Simple error handling and fallbacks

### SOLID Principles

- **Single Responsibility**: Each component and service has a specific purpose

  - NewsCard only handles displaying article data
  - FilterDrawer only manages filtering UI and state
  - API services only handle data fetching

- **Open-Closed**: Components are designed for extension

  - Easy to add new news sources
  - Filter system can be extended without changing existing code

- **Liskov Substitution**: Consistent interfaces for news articles

  - All news sources are normalized to a common article format
  - Sources can be interchanged without affecting the UI

- **Interface Segregation**: Specific interfaces for different domains

  - Separate types for articles vs. filters
  - Clear distinction between news and search contexts

- **Dependency Inversion**: High-level modules don't depend on details
  - Components use abstracted hooks and contexts
  - Services provide consistent interfaces regardless of API implementation
