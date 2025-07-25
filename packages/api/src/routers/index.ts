import { protectedProcedure, publicProcedure } from '../trpc';
import { todoRouter } from './todo';

export const router = {
	healthCheck: publicProcedure.query(() => {
		return 'OK';
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: 'This is private',
			user: ctx.session.user,
		};
	}),
	todo: todoRouter,
};
