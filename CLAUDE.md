# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A group bookmarking site where friends can save URLs via a Chrome extension. The site displays the last 50 bookmarks with an RSS feed. This is built as a monorepo using pnpm workspaces with shared TypeScript types across all packages.

## Monorepo Structure

```
bookmarks-app/
├── packages/
│   ├── shared/          # Shared TypeScript types
│   ├── website/         # Next.js App Router (deployed to Vercel)
│   └── extension/       # Chrome Extension (Manifest V3)
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Website**: Next.js 14+ with App Router, tRPC v10, Tailwind CSS
- **Database**: Vercel Postgres (free tier)
- **API**: tRPC for type-safe API between extension and server
- **Extension**: TypeScript Chrome Extension (Manifest V3)

## Development Commands

### Setup
```bash
pnpm install              # Install all dependencies across workspace
```

### Website Development
```bash
cd packages/website
pnpm dev                  # Run Next.js dev server (usually http://localhost:3000)
pnpm build               # Build for production
pnpm lint                # Run ESLint
```

### Extension Development
```bash
cd packages/extension
pnpm build               # Build extension for Chrome
pnpm watch              # Watch mode for development
```

### Workspace-wide
```bash
pnpm -r build           # Build all packages
pnpm -r lint            # Lint all packages
```

## Architecture Notes

### Type Safety Flow
1. Shared types defined in `packages/shared/src/types.ts`
2. tRPC routers in `packages/website/app/api/trpc/` consume these types
3. Extension imports from `@bookmarks/shared` for type safety when calling API
4. This ensures end-to-end type safety from browser extension → API → database

### Authentication
- Simple shared API key (no user accounts in MVP)
- API key stored in environment variable `API_KEY` on server
- Extension stores API key in chrome.storage after one-time setup
- Users set their display name in extension settings (sent as `savedBy` field)

### Database Schema
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

### API Endpoints (via tRPC)
- `bookmarks.create` - Create new bookmark (requires API key)
- `bookmarks.list` - Get latest 50 bookmarks
- RSS feed available at `/api/feed.xml` (standard Next.js API route, not tRPC)

### Chrome Extension Flow
1. User clicks extension icon
2. Popup grabs current tab URL and title via `chrome.tabs` API
3. User optionally adds note
4. Extension POSTs to tRPC API with apiKey, url, title, note, savedBy
5. Success/error shown in popup

## Environment Variables

Website requires `.env.local`:
```
POSTGRES_URL=your_vercel_postgres_url
API_KEY=shared_secret_key_here
```

## Deployment

- **Website**: Auto-deploy to Vercel from main branch
- **Extension**: Load unpacked from `packages/extension/dist` or package for Chrome Web Store
- Database setup requires running schema SQL in Vercel Postgres dashboard

## MVP Scope

What's included:
- Display last 50 bookmarks (no pagination)
- Basic API key auth
- RSS feed
- Mobile responsive website

What's NOT included (future enhancements):
- Search, tags, categories
- User accounts
- Archive beyond 50 items
- Comments
- Firefox extension
