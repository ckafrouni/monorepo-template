export * from './components/loader';

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import Loader from './components/loader';
import { routeTree } from './routeTree.gen';

import { deepLinkHandler } from './utils/deep-links';

import { TRPCReactProvider } from '@/utils/client-side';

interface AppProps {
	platform: 'web' | 'desktop';
}

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	defaultPendingComponent: () => <Loader />,
	context: {},
	Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
		return <TRPCReactProvider>{children}</TRPCReactProvider>;
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

export function App({ platform }: AppProps) {
	// Initialize deep link handler only for desktop platform
	if (platform === 'desktop') {
		deepLinkHandler.initialize(router);
	}

	// Frontend-initiated: Request initial URL when component is mounted and ready
	useEffect(() => {
		if (platform === 'desktop') {
			// Request initial URL after router is ready
			deepLinkHandler.requestInitialUrl();
		}
	}, [platform]);

	return <RouterProvider router={router} />;
}
