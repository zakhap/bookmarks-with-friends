import { NextResponse } from 'next/server';
import { getChannelContents } from '@/lib/arena';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const channelSlug = process.env.ARENA_CHANNEL_SLUG || 'bookmarks-with-friends';
  const bookmarks = await getChannelContents(channelSlug);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bookmarks with Friends</title>
    <link>${baseUrl}</link>
    <description>Shared bookmarks from friends</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/feed.xml" rel="self" type="application/rss+xml"/>
    ${bookmarks
      .map(
        (bookmark) => `
    <item>
      <title>${escapeXml(bookmark.title)}</title>
      <link>${escapeXml(bookmark.url)}</link>
      <guid isPermaLink="false">${bookmark.id}</guid>
      <pubDate>${new Date(bookmark.savedAt).toUTCString()}</pubDate>
      <author>${escapeXml(bookmark.savedBy)}</author>
      ${bookmark.note ? `<description>${escapeXml(bookmark.note)}</description>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
