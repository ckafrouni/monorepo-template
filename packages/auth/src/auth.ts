import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@zentio/db';
import * as schema from '@zentio/db/schema/auth';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ''],
	emailAndPassword: {
		enabled: true,
	},
});
