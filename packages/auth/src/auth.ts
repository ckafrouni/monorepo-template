import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@worspace/db';
import * as schema from '@worspace/db/schema/auth';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema,
	}),
	trustedOrigins: process.env.CORS_ORIGIN?.split(',') || [],
	emailAndPassword: {
		enabled: true,
	},
});
