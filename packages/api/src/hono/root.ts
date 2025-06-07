import { router } from '../routers';
import { createHonoRouter } from './trpc';

export const appRouter = createHonoRouter({
	router,
});

export type AppRouter = typeof appRouter;
