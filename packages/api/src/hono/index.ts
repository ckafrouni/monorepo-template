import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { Context as HonoContext } from 'hono';
import { appRouter } from '../root';
import { createHonoContext } from '../trpc';

/**
 * Create tRPC handler for Hono
 * This returns a middleware function that can be used with Hono
 */
export const createTRPCHandler = () => {
	return async (c: HonoContext) => {
		const response = await fetchRequestHandler({
			endpoint: '/trpc',
			req: c.req.raw,
			router: appRouter,
			createContext: () => createHonoContext(c),
		});
		return response;
	};
};

export { appRouter, type AppRouter } from '../root';
export { createHonoContext } from './trpc';
