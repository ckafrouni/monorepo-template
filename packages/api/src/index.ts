/**
 * Unified API package that can be used with both Next.js and Hono
 */

// Export unified tRPC configuration
export * from './trpc';

// Export routers
export { router } from './routers';

// Export Next.js specific
export { 
	appRouter as nextAppRouter,
	type AppRouter as NextAppRouter,
	createTRPCContext as createNextTRPCContext 
} from './nextjs';

// Export Hono specific
export { 
	appRouter as honoAppRouter,
	type AppRouter as HonoAppRouter,
	createTRPCHandler as createHonoTRPCHandler,
	createHonoContext 
} from './hono';

// Since both routers are identical, we can also export a unified type
export type AppRouter = import('./root').AppRouter; 