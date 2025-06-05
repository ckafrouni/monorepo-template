import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import Loader from './components/loader';
import { routeTree } from './routeTree.gen';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, trpc } from './utils/trpc';

// 🔍 Debug: Log current origin for Tauri debugging
if (typeof window !== 'undefined') {
	console.log('🌐 App Origin:', window.location.origin);
	console.log('🌐 App Protocol:', window.location.protocol);
	console.log('🌐 App Host:', window.location.host);
	console.log('🌐 User Agent:', navigator.userAgent);
}

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	defaultPendingComponent: () => <Loader />,
	context: { trpc, queryClient },
	Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
		return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById('app');

if (!rootElement) {
	throw new Error('Root element not found');
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
}
