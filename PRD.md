# Bookmarks Sharing Site MVP Specification

## Overview
Build a group bookmarking site where friends can save URLs via a browser extension. The site displays the last 50 bookmarks with an RSS feed.

## Architecture Decision
- Monorepo with TypeScript for type-safe API
- Deploy website to Vercel
- Chrome extension (Manifest V3)

## Tech Stack
- **Monorepo**: pnpm workspaces
- **Website**: Next.js (App Router) deployed to Vercel
- **Database**: Vercel Postgres (free tier)
- **API**: Next.js API routes with tRPC for type safety
- **Extension**: TypeScript Chrome extension
- **Shared**: Common types package

## Repository Structure
```
bookmarks-app/
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   └── types.ts      # Shared TypeScript types
│   │   └── package.json
│   ├── website/
│   │   ├── app/
│   │   │   ├── page.tsx      # Homepage showing 50 bookmarks
│   │   │   └── api/
│   │   │       └── trpc/     # tRPC endpoints
│   │   └── package.json
│   └── extension/
│       ├── manifest.json
│       ├── src/
│       │   ├── popup.tsx     # Extension popup
│       │   └── background.ts
│       └── package.json
├── pnpm-workspace.yaml
└── package.json
```

## MVP Features

### 1. API Endpoints
- POST /api/bookmarks - Create bookmark
- GET /api/bookmarks - Get latest 50
- GET /api/feed.xml - RSS feed

### 2. Website Features
- Single page showing last 50 bookmarks
- Display: URL, title, note (optional), saved by, timestamp
- Basic auth (environment variable for API key)
- RSS feed
- Mobile responsive

### 3. Extension Features
- Grab current tab URL and title
- Popup with optional note field
- Save button that POSTs to API
- Store API key in extension storage
- Success/error feedback

## Data Model
```typescript
interface Bookmark {
  id: string;
  url: string;
  title: string;
  note?: string;
  savedBy: string;
  savedAt: Date;
}

interface CreateBookmarkRequest {
  url: string;
  title: string;
  note?: string;
  apiKey: string;
}

interface GetBookmarksResponse {
  bookmarks: Bookmark[];
}
```

## Security
- Simple API key authentication (shared secret among friends)
- API key stored in environment variables on server
- Extension stores API key after one-time setup
- Rate limiting on POST endpoint

## Database Schema (Postgres)
```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  saved_by VARCHAR(100) NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_at ON bookmarks(saved_at DESC);
```

## Environment Variables
```
# .env.local (website)
POSTGRES_URL=your_vercel_postgres_url
API_KEY=shared_secret_key_here
```

## Deployment
- Website: Auto-deploy to Vercel from main branch
- Extension: Manual upload to Chrome Web Store (or load unpacked for friends)

## Development Priorities
1. Get basic API + database working
2. Simple webpage displaying bookmarks
3. RSS feed endpoint
4. Basic Chrome extension
5. Authentication

## Implementation Instructions for Claude Code

```
I want to build a bookmarking site MVP based on this specification.

Please:
1. Set up the monorepo structure with pnpm workspaces
2. Implement type-safe API with tRPC
3. Create a simple Next.js page showing bookmarks
4. Build a basic Chrome extension
5. Use Vercel Postgres for storage

Start with the backend API and types, then frontend, then extension.
Prioritize getting a working end-to-end flow over perfect UI.

Key requirements:
- Use Next.js App Router (not Pages Router)
- tRPC v10 with App Router support
- Tailwind CSS for styling
- Chrome Extension Manifest V3
- TypeScript throughout
```

## Notes
- Keep it simple - no user accounts, just shared API key
- No pagination beyond 50 items for MVP
- No search, tags, or categories yet
- Use Vercel's free Postgres tier
- Friends will set their "name" in the extension settings

## Future Enhancements (Not for MVP)
- Search functionality
- Tags/categories
- Archive beyond 50 items
- Comments on bookmarks
- Firefox extension
- Import/export functionality
