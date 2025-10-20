'use client';

import { useState, useEffect } from 'react';

export default function LocalTime({ etTime }: { etTime: Date }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show local time until client-side hydration
  if (!mounted) {
    return null;
  }

  // Check if user is in ET timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isET = userTimeZone === 'America/New_York' ||
               userTimeZone === 'America/Detroit' ||
               userTimeZone === 'America/Indiana/Indianapolis';

  // If user is already in ET, don't show redundant info
  if (isET) {
    return null;
  }

  // Get user's local time
  const localTime = etTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      {' '}
      <span style={{ color: '#CCC' }}>
        (YOUR TIME: {localTime.toUpperCase()})
      </span>
    </>
  );
}
