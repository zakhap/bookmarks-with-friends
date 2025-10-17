import { getChannelContents } from '@/lib/arena';
import type { Bookmark } from '@/lib/types';

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}

function formatTime(date: Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function BookmarkLink({ bookmark, isFeatured }: { bookmark: Bookmark; isFeatured?: boolean }) {
  return (
    <div style={{
      marginBottom: isFeatured ? '16px' : '10px',
      lineHeight: '1.3',
      textAlign: isFeatured ? 'center' : 'left',
    }}>
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: isFeatured ? '#CC0000' : '#000000',
          textDecoration: 'underline',
          fontSize: isFeatured ? '24px' : '14px',
          fontWeight: isFeatured ? 'bold' : 'normal',
          display: 'block',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        {bookmark.title.toUpperCase()}
      </a>
      {bookmark.note && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '4px',
          fontStyle: 'italic',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}>
          {bookmark.note}
        </div>
      )}
      <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
        {bookmark.savedBy} • {formatDate(bookmark.savedAt)} {formatTime(bookmark.savedAt)}
      </div>
    </div>
  );
}

export default async function Home() {
  const channelSlug = process.env.ARENA_CHANNEL_SLUG || 'bookmarks-with-friends';
  const bookmarks = await getChannelContents(channelSlug);
  const now = new Date();

  // Split bookmarks: first one is featured, rest are regular
  const featured = bookmarks[0];
  const leftColumn = bookmarks.slice(1, 26); // Next 25
  const rightColumn = bookmarks.slice(26, 50); // Last 24

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '10px 20px',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '12px 0 8px 0',
        borderBottom: '1px solid #000000',
        marginBottom: '12px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0',
          letterSpacing: '2px',
          lineHeight: '1',
        }}>
          BOOKMARKS WITH FRIENDS
        </h1>
        <div style={{
          fontSize: '9px',
          color: '#999',
          marginTop: '6px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).toUpperCase()} {now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }).toUpperCase()} ET
          {' '}
          <a href="/api/feed.xml" style={{ color: '#000000', textDecoration: 'underline' }}>
            [RSS]
          </a>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          fontSize: '14px',
          color: '#666',
        }}>
          <p style={{ margin: 0 }}>NO BOOKMARKS YET</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            Add bookmarks to your Are.na channel to get started
          </p>
        </div>
      ) : (
        <>
          {/* Featured/Top Bookmark */}
          {featured && (
            <div style={{
              borderBottom: '1px solid #CCCCCC',
              paddingBottom: '16px',
              marginBottom: '16px',
            }}>
              <BookmarkLink bookmark={featured} isFeatured={true} />
            </div>
          )}

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
          }}>
            {/* Left Column */}
            <div>
              {leftColumn.map((bookmark) => (
                <BookmarkLink key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>

            {/* Right Column */}
            <div>
              {rightColumn.map((bookmark) => (
                <BookmarkLink key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #000000',
        marginTop: '20px',
        paddingTop: '10px',
        textAlign: 'center',
        fontSize: '9px',
        color: '#999',
      }}>
        <div style={{ marginBottom: '6px' }}>
          <a href="/" style={{ color: '#000000', textDecoration: 'none', margin: '0 8px' }}>
            HOME
          </a>
          *
          <a href="/api/feed.xml" style={{ color: '#000000', textDecoration: 'none', margin: '0 8px' }}>
            RSS
          </a>
        </div>
        <div style={{ color: '#CCCCCC' }}>
          {bookmarks.length} BOOKMARKS • © {now.getFullYear()}
        </div>
      </div>
    </div>
  );
}
