/**
 * Create tRPC context for Next.js
 * This wraps the unified context creator with Next.js specific options
 */
export { createNextContext as createTRPCContext } from '../trpc';

/**
 * Export procedures and router creators from unified config
 */
export { createCallerFactory, createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export { appRouter, type AppRouter } from './root';
