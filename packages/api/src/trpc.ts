import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z, ZodError } from 'zod/v4';
import type { Context as HonoContext } from 'hono';

import { auth } from '@worspace/auth';
import { db } from '@worspace/db';

/**
 * Unified context type that works for both Next.js and Hono
 */
export interface UnifiedContext {
	authApi: typeof auth.api;
	session: Awaited<ReturnType<typeof auth.api.getSession>> | null;
	db: typeof db;
}

/**
 * Inner context that doesn't depend on request/response objects
 * This is the core context that all procedures will have access to
 */
export async function createInnerContext(headers: Headers): Promise<UnifiedContext> {
	const authApi = auth.api;
	const session = await authApi.getSession({ headers });
	
	return {
		authApi,
		session,
		db,
	};
}

/**
 * Context creator for Next.js
 */
export async function createNextContext(opts: { headers: Headers }): Promise<UnifiedContext> {
	return createInnerContext(opts.headers);
}

/**
 * Context creator for Hono
 */
export async function createHonoContext(c: HonoContext): Promise<UnifiedContext> {
	return createInnerContext(c.req.raw.headers);
}


/**
 * This is where the tRPC API is initialized, connecting the context and transformer
 */
const t = initTRPC.context<UnifiedContext>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error }) => ({
		...shape,
		data: {
			...shape.data,
			zodError:
				error.cause instanceof ZodError
					? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
					: null,
		},
	}),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now();

	if (t._config.isDev) {
		// artificial delay in dev 100-500ms
		const waitMs = Math.floor(Math.random() * 400) + 100;
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}

	const result = await next();

	const end = Date.now();
	console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

	return result;
});

/**
 * Public (unauthed) procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 */
export const protectedProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
}); 