# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A simple group bookmarking site that displays bookmarks from an Are.na channel in a Drudge Report-inspired Web 1.0 aesthetic. No database required - all data is stored in and fetched from Are.na.

## Architecture

- **Backend**: Are.na API (no database!)
- **Website**: Next.js 15 (App Router) deployed to Vercel
- **Bookmarking**: Use Are.na's official Chrome extension
- **Monorepo**: pnpm workspace with single website package

## Project Structure

```
bookmarks-with-friends/
├── packages/
│   └── website/              # Next.js application
│       ├── app/
│       │   ├── page.tsx          # Homepage (Drudge Report style)
│       │   ├── layout.tsx        # Root layout with Web 1.0 styling
│       │   └── api/feed.xml/     # RSS feed endpoint
│       └── lib/
│           ├── arena.ts          # Are.na API client
│           └── types.ts          # TypeScript types
├── pnpm-workspace.yaml
└── package.json
```

## Development Commands

### From Root
```bash
pnpm dev          # Run Next.js dev server
pnpm build        # Build for production
pnpm lint         # Run ESLint
```

### From packages/website
```bash
pnpm dev          # Run Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, inline styles (no CSS framework)
- **Backend**: Are.na API via `are.na` npm package
- **Deployment**: Vercel
- **Caching**: Next.js ISR (5-minute revalidation)

## How It Works

1. **Add bookmarks**: Use Are.na's Chrome extension to save links to your channel
2. **Fetch**: Next.js page fetches latest 50 bookmarks from Are.na API
3. **Display**: Drudge Report style - featured headline + two columns
4. **Cache**: Pages revalidate every 5 minutes for fast loading
5. **RSS**: Generated from Are.na channel data

## Environment Variables

`packages/website/.env.local`:
```
ARENA_CHANNEL_SLUG=your-channel-slug-here
ARENA_CLIENT_ID=your_client_id (optional)
ARENA_CLIENT_SECRET=your_client_secret (optional)
```

**Note:** Client ID/Secret only needed for private channels or write access. Public channels work without authentication.

## Key Files

- `lib/arena.ts` - Fetches bookmarks from Are.na API
- `lib/types.ts` - TypeScript interface for Bookmark
- `app/page.tsx` - Homepage with Drudge Report layout
- `app/api/feed.xml/route.ts` - RSS 2.0 feed generation

## Design Principles

### Drudge Report Aesthetic
- Times New Roman font
- Black links, red featured headline
- All caps titles
- Minimal styling, no fancy effects
- Featured bookmark at top (large, red, centered)
- Two-column layout for remaining bookmarks
- Tight spacing, information-dense

### Caching Strategy
- Homepage: `export const revalidate = 300` (5 minutes)
- RSS Feed: `Cache-Control: public, max-age=300` (5 minutes)
- Most visitors see cached pages, new bookmarks appear within 5 minutes

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Set `ARENA_CHANNEL_SLUG` environment variable
4. Deploy!

Vercel auto-detects Next.js and sets the root directory to `packages/website`.

## MVP Scope

**What's included:**
- Display last 50 bookmarks from Are.na
- Drudge Report / Web 1.0 aesthetic
- RSS feed
- Fast loading with caching
- Mobile responsive

**What's NOT included:**
- No database (Are.na is the database)
- No custom Chrome extension (use Are.na's)
- No search, tags, or categories
- No pagination beyond 50 items
- No user authentication (public channel)
