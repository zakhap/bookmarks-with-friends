import { getChannelContents } from '@/lib/arena';
import BookmarkItem from './BookmarkItem';
import ImageGallery from './ImageGallery';
import LocalTime from './LocalTime';

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

// Serve stale content while revalidating in the background for up to 24 hours
export const dynamic = 'force-static';
export const fetchCache = 'default-cache';

export default async function Home() {
  const channelSlug = process.env.ARENA_CHANNEL_SLUG || 'bookmarks-with-friends';
  const bookmarks = await getChannelContents(channelSlug);
  const now = new Date();

  // Organize bookmarks by type
  const links = bookmarks.filter(b => b.type === 'link');
  const images = bookmarks.filter(b => b.type === 'image');
  const textBlocks = bookmarks.filter(b => b.type === 'text');

  // For links: split into two columns
  const leftColumnLinks = links.slice(0, Math.ceil(links.length / 2));
  const rightColumnLinks = links.slice(Math.ceil(links.length / 2));

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
          fontSize: 'clamp(32px, 8vw, 48px)',
          fontWeight: 'bold',
          margin: '0',
          letterSpacing: '2px',
          lineHeight: '1',
        }}>
          INGROUP.NEWS
        </h1>
        <div style={{
          fontSize: 'clamp(10px, 2.5vw, 12px)',
          color: '#666',
          marginTop: '4px',
          fontStyle: 'italic',
        }}>
          bookmarks with friends
        </div>
        <div style={{
          fontSize: 'clamp(8px, 2vw, 9px)',
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
            timeZone: 'America/New_York',
          }).toUpperCase()} {now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/New_York',
          }).toUpperCase()} ET
          <LocalTime etTime={now} />
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
          {/* LINKS SECTION */}
          {links.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderBottom: '2px solid #000',
                paddingBottom: '8px',
                marginBottom: '16px',
                letterSpacing: '1px',
              }}>
                Links
              </h2>

              {/* Two Column Layout for Links (single column on mobile) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                gap: '40px',
              }}>
                <div>
                  {leftColumnLinks.map((bookmark) => (
                    <BookmarkItem key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
                <div>
                  {rightColumnLinks.map((bookmark) => (
                    <BookmarkItem key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* IMAGES SECTION */}
          {images.length > 0 && (
            <ImageGallery images={images} />
          )}

          {/* TEXT BLOCKS SECTION */}
          {textBlocks.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderBottom: '2px solid #000',
                paddingBottom: '8px',
                marginBottom: '16px',
                letterSpacing: '1px',
              }}>
                Text
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                {textBlocks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    style={{
                      padding: '16px',
                      border: '1px solid #CCCCCC',
                      backgroundColor: '#FAFAFA',
                    }}
                  >
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginTop: '0',
                      marginBottom: '8px',
                    }}>
                      {bookmark.title}
                    </h3>
                    {bookmark.note && (
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        marginBottom: '8px',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {bookmark.note}
                      </div>
                    )}
                    <div style={{
                      fontSize: '10px',
                      color: '#999',
                      marginTop: '8px',
                      borderTop: '1px solid #DDD',
                      paddingTop: '8px',
                    }}>
                      {bookmark.savedBy} • {new Date(bookmark.savedAt).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit',
                      })} {new Date(bookmark.savedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
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
          <span style={{ color: '#000000', margin: '0 8px' }}>
            HOME
          </span>
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
