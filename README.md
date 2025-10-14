# Bookmarks with Friends

A simple group bookmarking site where friends can save and share URLs via a Chrome extension. Features a Drudge Report-inspired Web 1.0 aesthetic.

## Architecture

- **Monorepo**: pnpm workspaces with TypeScript
- **Website**: Next.js 15 (App Router) deployed to Vercel
- **Database**: Neon Postgres (via Vercel Storage)
- **API**: tRPC for type-safe API calls
- **Extension**: Chrome Extension (Manifest V3)

## Project Structure

```
bookmarks-with-friends/
├── packages/
│   ├── shared/          # Shared TypeScript types
│   ├── website/         # Next.js website + API
│   └── extension/       # Chrome extension
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Vercel account (for deployment)
- Neon Postgres database (via Vercel Storage)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run website dev server
cd packages/website
pnpm dev

# Build extension
cd packages/extension
pnpm build
```

### Environment Variables

Create `packages/website/.env.local`:

```env
# Neon Postgres (pulled from Vercel)
POSTGRES_URL="postgresql://..."

# Your shared API key
API_KEY="your_secret_key_here"
```

## Deployment

### Website

1. Push code to GitHub
2. Import project to Vercel
3. Add Neon Postgres from Vercel Storage marketplace
4. Add `API_KEY` environment variable in Vercel dashboard
5. Deploy!

### Chrome Extension

1. Build the extension: `cd packages/extension && pnpm build`
2. Add icon files (icon16.png, icon48.png, icon128.png) to `packages/extension/`
3. Rebuild: `pnpm build`
4. Load unpacked extension from `packages/extension/dist` in Chrome
5. Configure with your Vercel URL and API key

See `packages/extension/README.md` for detailed instructions.

## Features

- ✅ Save bookmarks from any webpage
- ✅ View last 50 bookmarks on homepage
- ✅ RSS feed for bookmark updates
- ✅ Simple API key authentication
- ✅ Web 1.0 / Drudge Report aesthetic
- ✅ Mobile responsive
- ✅ Recent bookmarks highlighted (< 1 hour old)

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC v11
- **Database**: Neon Postgres (serverless)
- **Validation**: Zod
- **Deployment**: Vercel
- **Extension**: TypeScript, Webpack

## MVP Limitations

- Single shared API key (no individual user accounts)
- No search functionality
- No pagination (shows last 50 bookmarks only)
- No tags or categories
- No bookmark editing or deletion

## License

MIT
