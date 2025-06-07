/**
 * Next.js specific tRPC configuration
 * This file re-exports the unified tRPC configuration with Next.js specific context
 */
import { auth } from '@worspace/auth';
import { createNextContext } from '../trpc';

/**
 * Create tRPC context based on Next.js headers
 */
export const createTRPCContext = async (opts: { headers: Headers; auth: typeof auth }) => {
	// Pass Next.js request headers to the unified context creator
	return createNextContext({
		headers: opts.headers,
	});
};

// Re-export everything from unified config
export * from '../trpc';
