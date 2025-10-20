import Link from 'next/link';

export default function NotFound() {
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
        marginBottom: '40px',
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
      </div>

      {/* 404 Content */}
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
      }}>
        <div style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#CC0000',
          marginBottom: '20px',
          letterSpacing: '4px',
        }}>
          404
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '12px',
          letterSpacing: '1px',
        }}>
          PAGE NOT FOUND
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '30px',
        }}>
          The page you are looking for does not exist.
        </div>
        <Link
          href="/"
          style={{
            fontSize: '14px',
            color: '#000000',
            textDecoration: 'underline',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          → RETURN TO HOMEPAGE
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #000000',
        marginTop: '60px',
        paddingTop: '10px',
        textAlign: 'center',
        fontSize: '9px',
        color: '#999',
      }}>
        <div style={{ marginBottom: '6px' }}>
          <Link href="/" style={{ color: '#000000', textDecoration: 'none', margin: '0 8px' }}>
            HOME
          </Link>
          *
          <a href="/api/feed.xml" style={{ color: '#000000', textDecoration: 'none', margin: '0 8px' }}>
            RSS
          </a>
        </div>
        <div style={{ color: '#CCCCCC' }}>
          © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
