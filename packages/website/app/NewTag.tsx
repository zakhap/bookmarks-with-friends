'use client';

import { useState, useEffect } from 'react';

interface NewTagProps {
  savedAt: Date;
}

export default function NewTag({ savedAt }: NewTagProps) {
  const [isNew, setIsNew] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    // Wait for client-side hydration
    const lastVisit = localStorage.getItem('lastVisit');

    if (!lastVisit) {
      // First time visitor - don't show NEW
      return;
    }

    const lastVisitTime = parseInt(lastVisit, 10);
    const bookmarkTime = new Date(savedAt).getTime();

    // 5 minute buffer (300,000ms) to account for refreshes
    const bufferMs = 5 * 60 * 1000;

    // Check if bookmark is newer than last visit (with buffer)
    if (bookmarkTime > lastVisitTime - bufferMs) {
      setIsNew(true);

      // Calculate time ago
      const now = Date.now();
      const diffMs = now - bookmarkTime;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setTimeAgo(`${diffDays}d ago`);
      } else if (diffHours > 0) {
        setTimeAgo(`${diffHours}h ago`);
      } else if (diffMinutes > 0) {
        setTimeAgo(`${diffMinutes}m ago`);
      } else {
        setTimeAgo('just now');
      }
    }
  }, [savedAt]);

  // Update lastVisit after 10 seconds on page
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('lastVisit', Date.now().toString());
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isNew) {
    return null;
  }

  return (
    <>
      {' '}
      <span style={{
        color: '#CC0000',
        fontSize: '10px',
        fontWeight: 'normal',
        letterSpacing: '0.5px',
      }}>
        [NEW]
      </span>
      {' '}
      <span style={{
        color: '#999',
        fontSize: '9px',
        fontWeight: 'normal',
      }}>
        [{timeAgo}]
      </span>
    </>
  );
}
