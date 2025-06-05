import type { AnyRouter } from '@tanstack/react-router';

export interface DeepLinkHandler {
	initialize: (router: AnyRouter) => void;
	requestInitialUrl: () => void;
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
	let isInitialized = false;

	const handleDeepLink = (url: string) => {
		console.log('🎯 Deep link received:', url);
		const route = parseDeepLink(url);
		console.log('🗂️ Parsed route:', route);

		if (route && currentRouter) {
			console.log('🧭 Navigating to route:', route);
			try {
				const result = currentRouter.navigate({ to: route });
				if (result instanceof Promise) {
					result.catch((error) => {
						console.error('❌ Navigation failed:', error);
					});
				}
			} catch (error) {
				console.error('❌ Navigation error:', error);
			}
		} else {
			if (!route) console.warn('⚠️ Could not parse route from URL:', url);
			if (!currentRouter) console.warn('⚠️ Router not available');
		}
	};

	const initialize = (router: AnyRouter) => {
		console.log('🚀 Initializing deep link handler...');
		currentRouter = router;

		// Setup deep link event listener (but don't request initial URL yet)
		Promise.all([import('@tauri-apps/api/event')])
			.then(([{ listen }]) => {
				console.log('📡 Setting up deep-link event listener...');
				// Listen for all deep link events from Tauri (both initial and subsequent)
				listen('deep-link', (event: any) => {
					handleDeepLink(event.payload);
				}).catch((error) => {
					console.error('❌ Failed to setup deep-link listener:', error);
				});

				isInitialized = true;
				console.log('✅ Deep link handler initialized and ready');
			})
			.catch((error) => {
				console.log('ℹ️ Not in Tauri environment:', error);
				isInitialized = true;
			});
	};

	const requestInitialUrl = () => {
		// Only request initial URL when frontend is explicitly ready
		if (!isInitialized) {
			console.warn('Deep link handler not initialized yet, retrying...');
			// Retry after a short delay if not initialized
			setTimeout(requestInitialUrl, 100);
			return;
		}

		console.log('🔗 Frontend requesting initial URL from Tauri...');

		import('@tauri-apps/api/core')
			.then(({ invoke }) => {
				// Request initial URL - Tauri will emit it as a deep-link event if it exists
				invoke('request_initial_url')
					.then(() => {
						console.log('✅ Initial URL request sent to Tauri backend');
					})
					.catch((error) => {
						console.warn('❌ Failed to request initial URL:', error);
					});
			})
			.catch(() => {
				console.log('ℹ️ Not in Tauri environment - skipping initial URL request');
			});
	};

	return {
		initialize,
		requestInitialUrl,
		parseDeepLink,
	};
}

// Export a singleton instance
export const deepLinkHandler = createDeepLinkHandler();
