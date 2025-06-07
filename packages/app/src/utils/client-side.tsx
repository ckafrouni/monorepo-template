'use client';

import type { QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchStreamLink, loggerLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import SuperJSON from 'superjson';

import type { AppRouter } from '@worspace/api/src';

import { createQueryClient } from './query-client';

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
	if (typeof window === 'undefined') {
		// Server: always make a new query client
		return createQueryClient();
	} else {
		// Browser: use singleton pattern to keep the same query client
		return (clientQueryClientSingleton ??= createQueryClient());
	}
};

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				loggerLink({
					enabled: (op) =>
						import.meta.env.DEV ||
						(op.direction === 'down' && op.result instanceof Error),
				}),
				httpBatchStreamLink({
					transformer: SuperJSON,
					url: getBaseUrl() + '/api/trpc',
					headers() {
						const headers = new Headers();
						headers.set('x-trpc-source', 'web-app');
						return headers;
					},
				}),
			],
		})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{props.children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}

const getBaseUrl = () => {
	// For client-side in Vite, we use import.meta.env
	if (typeof window !== 'undefined' && import.meta.env.VITE_SERVER_URL) {
		return import.meta.env.VITE_SERVER_URL;
	}
	// Fallback to localhost
	return 'http://localhost:8080';
};
