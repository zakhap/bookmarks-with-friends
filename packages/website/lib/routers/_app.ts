import { router } from '../trpc';
import { bookmarksRouter } from './bookmarks';

export const appRouter = router({
  bookmarks: bookmarksRouter,
});

export type AppRouter = typeof appRouter;
