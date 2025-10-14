import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './routers/_app';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }

  if (process.env.VERCEL_URL) {
    // SSR on Vercel
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local dev
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
