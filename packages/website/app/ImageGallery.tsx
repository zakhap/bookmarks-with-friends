'use client';

import { useState, useEffect } from 'react';
import type { Bookmark } from '@/lib/types';

export default function ImageGallery({ images }: { images: Bookmark[] }) {
  const [selectedImage, setSelectedImage] = useState<Bookmark | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [selectedImage]);

  return (
    <>
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
          Images
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'flex-start',
        }}>
          {images.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => setSelectedImage(bookmark)}
              style={{
                display: 'block',
                border: '1px solid #CCCCCC',
                flex: '0 0 auto',
                padding: 0,
                cursor: 'pointer',
                background: 'none',
              }}
            >
              <img
                src={bookmark.imageUrl}
                alt={bookmark.title}
                loading="lazy"
                style={{
                  display: 'block',
                  height: 'clamp(150px, 30vw, 200px)',
                  width: 'auto',
                  maxWidth: '100%',
                }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <img
            src={selectedImage.url}
            alt={selectedImage.title}
            loading="lazy"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              border: '2px solid #fff',
              animation: 'scaleIn 0.2s ease-out',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
