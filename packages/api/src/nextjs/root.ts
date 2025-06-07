import { router } from '../routers';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
	router,
});

export type AppRouter = typeof appRouter;
