import { defaultShouldDehydrateQuery, QueryClient, QueryCache } from '@tanstack/react-query';
import SuperJSON from 'superjson';
import { toast } from 'sonner';

export const createQueryClient = () => {
	const queryClient = new QueryClient({
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
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 30 * 1000,
			},
			dehydrate: {
				serializeData: SuperJSON.serialize,
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
				shouldRedactErrors: () => {
					// We should not catch Next.js server errors
					// as that's how Next.js detects dynamic pages
					// so we cannot redact them.
					// Next.js also automatically redacts errors for us
					// with better digests.
					return false;
				},
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize,
			},
		},
	});
	return queryClient;
};
