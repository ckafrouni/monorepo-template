import { initTRPC, TRPCError } from '@trpc/server';
import type { Context as HonoContext } from 'hono';
import { auth } from '@worspace/auth';
import { db } from '@worspace/db';

// Hono

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createHonoContext({ context }: CreateContextOptions) {
	const authApi = auth.api;
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});
	return {
		authApi,
		session,
		db,
	};
}

export type Context = Awaited<ReturnType<typeof createHonoContext>>;

export const t = initTRPC.context<Context>().create();

export const createHonoRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Authentication required',
			cause: 'No session',
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});
