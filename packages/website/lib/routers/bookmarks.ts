import { z } from 'zod';
import { router, publicProcedure, authenticatedProcedure } from '../trpc';
import { createBookmark, getLatestBookmarks } from '../db';

export const bookmarksRouter = router({
  list: publicProcedure.query(async () => {
    const bookmarks = await getLatestBookmarks(50);
    return { bookmarks };
  }),

  create: authenticatedProcedure
    .input(
      z.object({
        url: z.string().url('Must be a valid URL'),
        title: z.string().min(1, 'Title is required'),
        note: z.string().optional(),
        savedBy: z.string().min(1, 'Saved by name is required'),
        apiKey: z.string().min(1, 'API key is required'),
      })
    )
    .mutation(async ({ input }) => {
      const bookmark = await createBookmark(
        input.url,
        input.title,
        input.savedBy,
        input.note
      );

      return { bookmark };
    }),
});
