'use client';

import { useState, useEffect } from 'react';
import type { Bookmark } from '@/lib/types';

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

export default function BookmarkItem({ bookmark, isFeatured }: { bookmark: Bookmark; isFeatured?: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (isHovering && bookmark.type === 'image') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isHovering, bookmark.type]);

  const isClickable = bookmark.url && (bookmark.type === 'link' || bookmark.type === 'image');

  return (
    <div style={{
      marginBottom: isFeatured ? '16px' : '10px',
      lineHeight: '1.3',
      textAlign: isFeatured ? 'center' : 'left',
      position: 'relative',
    }}>
      {isClickable ? (
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
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
      ) : (
        <span style={{
          color: isFeatured ? '#CC0000' : '#000000',
          fontSize: isFeatured ? '24px' : '14px',
          fontWeight: isFeatured ? 'bold' : 'normal',
          display: 'block',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}>
          {bookmark.title.toUpperCase()}
        </span>
      )}

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

      {/* Hover image preview */}
      {bookmark.type === 'image' && bookmark.imageUrl && isHovering && (
        <img
          src={bookmark.imageUrl}
          alt={bookmark.title}
          style={{
            position: 'fixed',
            left: `${mousePos.x + 20}px`,
            top: `${mousePos.y + 20}px`,
            width: '250px',
            height: 'auto',
            maxHeight: '300px',
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: 1000,
            border: '1px solid #000',
            backgroundColor: '#fff',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
          }}
        />
      )}
    </div>
  );
}
