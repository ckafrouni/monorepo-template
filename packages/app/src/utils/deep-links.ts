import type { AnyRouter } from '@tanstack/react-router';

export interface DeepLinkHandler {
	initialize: (router: AnyRouter) => void;
	parseDeepLink: (url: string) => string | null;
}

/**
 * Maps deep link paths to TanStack Router routes
 */
const ROUTE_MAPPING: Record<string, string> = {
	'': '/', // zentio:// -> home
	'/': '/', // zentio:/// -> home
	todos: '/todos',
	dashboard: '/dashboard',
	ai: '/ai',
	login: '/login',
	// Add more routes as needed
};

/**
 * Parses a deep link URL and returns the corresponding route path
 */
export function parseDeepLink(url: string): string | null {
	try {
		// Handle zentio:// URLs
		if (url.startsWith('zentio://')) {
			// Extract everything after 'zentio://'
			const pathPart = url.substring('zentio://'.length);

			// If empty or just slashes, go to home
			if (!pathPart || pathPart === '/' || pathPart === '') {
				return '/';
			}

			// Remove leading slash for mapping lookup
			const lookupKey = pathPart.startsWith('/') ? pathPart.substring(1) : pathPart;

			// Find the mapped route
			const mappedRoute = ROUTE_MAPPING[lookupKey];

			if (mappedRoute) {
				return mappedRoute;
			}

			// If no mapping found, try to use as direct path
			const directPath = pathPart.startsWith('/') ? pathPart : '/' + pathPart;
			return directPath;
		}

		return null;
	} catch (error) {
		return null;
	}
}

/**
 * Creates a deep link handler that integrates with TanStack Router
 */
export function createDeepLinkHandler(): DeepLinkHandler {
	let currentRouter: AnyRouter | null = null;

	const handleDeepLink = (url: string) => {
		const route = parseDeepLink(url);

		if (route && currentRouter) {
			try {
				const result = currentRouter.navigate({ to: route });
				if (result instanceof Promise) {
					result.catch(() => {
						// Silent error handling
					});
				}
			} catch (error) {
				// Silent error handling
			}
		}
	};

	const initialize = (router: AnyRouter) => {
		currentRouter = router;

		Promise.all([import('@tauri-apps/api/event'), import('@tauri-apps/api/core')])
			.then(([{ listen }, { invoke }]) => {
				// Listen for subsequent deep link events from Tauri
				listen('deep-link', (event: any) => {
					handleDeepLink(event.payload);
				}).catch(() => {
					// Silent error handling
				});

				// Check for initial launch URL
				invoke('get_initial_url')
					.then((initialUrl: any) => {
						if (initialUrl) {
							handleDeepLink(initialUrl);
						}
					})
					.catch(() => {
						// Silent error handling
					});
			})
			.catch(() => {
				// Silent error handling - not in Tauri environment
			});
	};

	return {
		initialize,
		parseDeepLink,
	};
}

// Export a singleton instance
export const deepLinkHandler = createDeepLinkHandler();
