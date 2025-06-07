/**
 * Hono specific tRPC configuration
 * This file re-exports the unified tRPC configuration with Hono specific context
 */
import { createHonoContext as createContext } from '../trpc';

/**
 * Create tRPC context for Hono
 */
export const createHonoContext = createContext;

// Re-export everything from unified config
export * from '../trpc';
