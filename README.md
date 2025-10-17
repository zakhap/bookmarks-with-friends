# Bookmarks with Friends

A simple group bookmarking site that displays bookmarks from an Are.na channel in a Drudge Report-inspired Web 1.0 aesthetic.

## Architecture

- **Backend**: Are.na API (no database needed!)
- **Website**: Next.js 15 (App Router) deployed to Vercel
- **Bookmarking**: Use Are.na's official Chrome extension
- **Monorepo**: pnpm workspaces with TypeScript

## How It Works

1. **Add bookmarks**: Use [Are.na's Chrome extension](https://chrome.google.com/webstore/detail/arena/lebjfedlgfngdohfjgmempkjpmkpmcnb) to save links to your Are.na channel
2. **Website fetches**: The Next.js site reads from the Are.na API
3. **Display**: Bookmarks are shown in Drudge Report style (featured + two columns)
4. **RSS feed**: Generated from Are.na channel contents

## Features

- ✅ Drudge Report / Web 1.0 aesthetic
- ✅ Featured headline (most recent bookmark in large red text)
- ✅ Two-column layout for remaining bookmarks
- ✅ RSS feed at `/api/feed.xml`
- ✅ 5-minute caching for fast page loads
- ✅ Shows last 50 bookmarks
- ✅ Mobile responsive
- ✅ No database needed (Are.na handles storage)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- An Are.na account
- Vercel account (for deployment)

### Installation

```bash
# Install dependencies
pnpm install
```

### Setup

1. **Create an Are.na channel** (e.g., "bookmarks-with-friends")
2. **Get the channel slug** from the URL: `https://www.are.na/username/channel-slug`
3. **Install Are.na Chrome extension** from the Chrome Web Store
4. **Configure environment variables**:

Create `packages/website/.env.local`:

```env
ARENA_CHANNEL_SLUG=your-channel-slug-here
```

### Development

```bash
cd packages/website
pnpm dev
```

Visit http://localhost:3000

### Adding Bookmarks

1. Install the [Are.na Chrome extension](https://chrome.google.com/webstore/detail/arena/lebjfedlgfngdohfjgmempkjpmkpmcnb)
2. Sign in to your Are.na account
3. Navigate to any webpage
4. Click the Are.na extension icon
5. Add to your bookmarks channel
6. Refresh your local site to see the new bookmark

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variable in Vercel dashboard:
   - `ARENA_CHANNEL_SLUG`: Your Are.na channel slug
4. Deploy!

## Caching Strategy

- **Homepage**: Revalidates every 5 minutes (Next.js ISR)
- **RSS Feed**: 5-minute HTTP cache headers
- **Are.na API**: Called on-demand, cached by Next.js

This means most visitors get a fast, cached page while new bookmarks appear within 5 minutes.

## Project Structure

```
bookmarks-with-friends/
├── packages/
│   ├── shared/          # Shared TypeScript types
│   └── website/         # Next.js site
│       ├── app/
│       │   ├── page.tsx      # Homepage (Drudge Report style)
│       │   └── api/feed.xml/  # RSS feed
│       └── lib/
│           └── arena.ts       # Are.na API client
└── pnpm-workspace.yaml
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, inline styles
- **Backend**: Are.na API via `are.na` npm package
- **Deployment**: Vercel
- **No database**: Are.na handles all storage
- **No custom extension**: Use Are.na's official Chrome extension

## Why Are.na?

- **No database setup** - Are.na stores everything
- **Beautiful web UI** - Visual interface for managing bookmarks
- **Collaborative** - Multiple people can add to the channel
- **Rich content** - Beyond just links (images, text, PDFs)
- **Well-maintained API** - Official npm package
- **Existing Chrome extension** - No need to build/maintain our own

## License

MIT
