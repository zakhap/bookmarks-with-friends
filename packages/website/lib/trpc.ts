import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for API key authentication
export const authenticatedProcedure = t.procedure.use(async (opts) => {
  const { ctx, input } = opts;

  // Check if input has apiKey
  if (typeof input !== 'object' || input === null || !('apiKey' in input)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'API key is required',
    });
  }

  const apiKey = (input as { apiKey: string }).apiKey;
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'API key not configured on server',
    });
  }

  if (apiKey !== expectedApiKey) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid API key',
    });
  }

  return opts.next({
    ctx,
  });
});
