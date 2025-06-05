import type { AppRouter } from '@zentio/api';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(error.message, {
				action: {
					label: 'retry',
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

export const trpcClient: ReturnType<typeof createTRPCClient<AppRouter>> =
	createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: 'include',
					});
				},
			}),
		],
	});

export const trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>> =
	createTRPCOptionsProxy<AppRouter>({
		client: trpcClient,
		queryClient,
	});
